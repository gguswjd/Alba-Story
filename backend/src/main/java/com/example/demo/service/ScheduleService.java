package com.example.demo.service;

import com.example.demo.dto.request.ScheduleGenerateRequest;
import com.example.demo.dto.request.SchedulePreferenceRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.theokanning.openai.completion.CompletionRequest;
import com.theokanning.openai.completion.CompletionResult;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private WorkplaceRepository workplaceRepository;

    @Autowired
    private WorkInfoRepository workInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchedulePreferenceRepository schedulePreferenceRepository;

    @Autowired
    private SchedulePreferenceSlotRepository schedulePreferenceSlotRepository;

    @Autowired(required = false)
    private OpenAiService openAiService;

    @Autowired
    private ObjectMapper objectMapper;

    // 알바생 월간 선호도 등록/갱신
    @Transactional
    public SchedulePreference saveSchedulePreference(Long userId, SchedulePreferenceRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Workplace workplace = workplaceRepository.findById(request.getWorkplaceId())
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        workInfoRepository.findByUserUserIdAndWorkplaceWorkplaceId(userId, request.getWorkplaceId())
                .orElseThrow(() -> new RuntimeException("해당 매장의 직원이 아닙니다"));

        LocalDate targetMonth = LocalDate.of(request.getYear(), request.getMonth(), 1);

        SchedulePreference preference = schedulePreferenceRepository
                .findByUserUserIdAndWorkplaceWorkplaceIdAndTargetMonth(userId, request.getWorkplaceId(), targetMonth)
                .orElseGet(() -> {
                    SchedulePreference p = new SchedulePreference();
                    p.setUser(user);
                    p.setWorkplace(workplace);
                    p.setTargetMonth(targetMonth);
                    return p;
                });

        Set<LocalDate> incomingDates = request.getDays().stream()
                .map(SchedulePreferenceRequest.DayPreference::getDate)
                .collect(Collectors.toSet());

        if (request.isOverwrite()) {
            preference.getSlots().clear();
        } else {
            preference.getSlots().removeIf(slot -> incomingDates.contains(slot.getWorkDate()));
        }

        for (SchedulePreferenceRequest.DayPreference dayPreference : request.getDays()) {
            LocalDate workDate = dayPreference.getDate();
            for (SchedulePreferenceRequest.TimeRange range : dayPreference.getSlots()) {
                LocalTime start = LocalTime.parse(range.getStartTime());
                LocalTime end = LocalTime.parse(range.getEndTime());
                if (!start.isBefore(end)) {
                    throw new RuntimeException("시작 시간이 종료 시간보다 빠르지 않습니다: " + workDate);
                }
                SchedulePreferenceSlot slot = new SchedulePreferenceSlot();
                slot.setWorkDate(workDate);
                slot.setStartTime(start);
                slot.setEndTime(end);
                preference.addSlot(slot);
            }
        }

        return schedulePreferenceRepository.save(preference);
    }

    // AI 기반 스케줄 생성
    @Transactional
    public List<Schedule> generateOptimalSchedule(ScheduleGenerateRequest request) {
        Workplace workplace = workplaceRepository.findById(request.getWorkplaceId())
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        validateDateRange(request);

        List<WorkInfo> employees = workInfoRepository.findByWorkplaceWorkplaceId(request.getWorkplaceId());
        if (employees.isEmpty()) {
            throw new RuntimeException("근무지에 등록된 직원이 없습니다");
        }

        Map<Long, User> employeeMap = employees.stream()
                .map(WorkInfo::getUser)
                .collect(Collectors.toMap(User::getUserId, u -> u));

        List<SchedulePreferenceSlot> preferenceSlots = schedulePreferenceSlotRepository
                .findByPreferenceWorkplaceWorkplaceIdAndWorkDateBetween(
                        request.getWorkplaceId(),
                        request.getStartDate(),
                        request.getEndDate()
                );

        Map<LocalDate, Map<Long, List<SchedulePreferenceSlot>>> preferenceByDateAndUser = preferenceSlots.stream()
                .collect(Collectors.groupingBy(
                        SchedulePreferenceSlot::getWorkDate,
                        Collectors.groupingBy(slot -> slot.getPreference().getUser().getUserId())
                ));

        // 기존 스케줄 덮어쓰기 옵션
        if (request.isOverwriteExisting()) {
            scheduleRepository.deleteByWorkplaceWorkplaceIdAndStartTimeBetween(
                    request.getWorkplaceId(),
                    request.getStartDate().atStartOfDay(),
                    request.getEndDate().atTime(23, 59, 59)
            );
        }

        List<PlannedSlot> plannedSlots = generateScheduleWithAI(request, employees, preferenceByDateAndUser);
        return persistSchedules(plannedSlots, workplace, employeeMap);
    }

    // 스케줄 수정
    @Transactional
    public Schedule updateSchedule(Long scheduleId, LocalDateTime startTime, LocalDateTime endTime) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("스케줄을 찾을 수 없습니다"));

        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setStatus(Schedule.ScheduleStatus.modified);

        return scheduleRepository.save(schedule);
    }

    // 스케줄 삭제
    @Transactional
    public void deleteSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("스케줄을 찾을 수 없습니다"));

        schedule.setStatus(Schedule.ScheduleStatus.cancelled);
        scheduleRepository.save(schedule);
    }

    // 근무지 스케줄 조회
    public List<Schedule> getSchedulesByWorkplace(Long workplaceId) {
        return scheduleRepository.findByWorkplaceWorkplaceId(workplaceId);
    }

    // 사용자 스케줄 조회
    public List<Schedule> getSchedulesByUser(Long userId) {
        return scheduleRepository.findByUserUserId(userId);
    }

    // 스케줄 충돌 추가
    public boolean hasScheduleConflict(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Schedule> userSchedules = scheduleRepository.findByUserUserId(userId);

        return userSchedules.stream()
                .anyMatch(schedule -> 
                    !(schedule.getEndTime().isBefore(startTime) || schedule.getStartTime().isAfter(endTime))
                );
    }

    private void validateDateRange(ScheduleGenerateRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new RuntimeException("시작일이 종료일보다 늦습니다");
        }
        if (!request.getOpenTime().isBefore(request.getCloseTime())) {
            throw new RuntimeException("영업 시작/종료 시간이 올바르지 않습니다");
        }
        if (request.getSlotHours() == null || request.getSlotHours() <= 0) {
            throw new RuntimeException("스케줄 단위(slotHours)를 설정해야 합니다");
        }
    }

    private List<PlannedSlot> generateScheduleWithAI(
            ScheduleGenerateRequest request,
            List<WorkInfo> employees,
            Map<LocalDate, Map<Long, List<SchedulePreferenceSlot>>> preferenceByDateAndUser
    ) {
        List<User> allowedEmployees = employees.stream()
                .map(WorkInfo::getUser)
                .filter(u -> request.getExcludeUserIds() == null || !request.getExcludeUserIds().contains(u.getUserId()))
                .toList();

        Map<Long, WorkInfo> workInfoMap = employees.stream()
                .collect(Collectors.toMap(w -> w.getUser().getUserId(), w -> w));

        Map<String, Object> promptPayload = buildPromptPayload(request, allowedEmployees, workInfoMap, preferenceByDateAndUser);
        String aiResponse = callOpenAIForSchedule(promptPayload);

        List<PlannedSlot> aiPlan = parseAiSchedule(aiResponse);
        if (!aiPlan.isEmpty()) {
            return aiPlan;
        }

        return generateFallbackPlan(request, allowedEmployees, preferenceByDateAndUser);
    }

    private Map<String, Object> buildPromptPayload(
            ScheduleGenerateRequest request,
            List<User> allowedEmployees,
            Map<Long, WorkInfo> workInfoMap,
            Map<LocalDate, Map<Long, List<SchedulePreferenceSlot>>> preferenceByDateAndUser
    ) {
        Map<String, Object> payload = new LinkedHashMap<>();

        payload.put("store", Map.of(
                "workplaceId", request.getWorkplaceId(),
                "openTime", request.getOpenTime().toString(),
                "closeTime", request.getCloseTime().toString(),
                "slotHours", request.getSlotHours()
        ));

        Map<String, Object> constraints = new LinkedHashMap<>();
        constraints.put("minStaffPerSlot", request.getMinStaffPerSlot());
        constraints.put("maxStaffPerSlot", request.getMaxStaffPerSlot());
        constraints.put("roleRequirements", request.getRoleRequirements());
        constraints.put("excludeUserIds", request.getExcludeUserIds());
        constraints.put("maxConsecutiveHours", request.getMaxConsecutiveHours());
        constraints.put("offDays", request.getOffDays());
        constraints.put("dateRange", Map.of(
                "startDate", request.getStartDate().toString(),
                "endDate", request.getEndDate().toString()
        ));
        payload.put("constraints", constraints);

        List<Map<String, Object>> employees = new ArrayList<>();
        for (User user : allowedEmployees) {
            WorkInfo info = workInfoMap.get(user.getUserId());
            Map<String, Object> emp = new LinkedHashMap<>();
            emp.put("userId", user.getUserId());
            emp.put("name", user.getName());
            emp.put("role", info != null ? info.getPosition() : null);
            employees.add(emp);
        }
        payload.put("employees", employees);

        List<Map<String, Object>> preferences = new ArrayList<>();
        for (Map.Entry<LocalDate, Map<Long, List<SchedulePreferenceSlot>>> dateEntry : preferenceByDateAndUser.entrySet()) {
            LocalDate date = dateEntry.getKey();
            for (Map.Entry<Long, List<SchedulePreferenceSlot>> userEntry : dateEntry.getValue().entrySet()) {
                Map<String, Object> pref = new LinkedHashMap<>();
                pref.put("date", date.toString());
                pref.put("userId", userEntry.getKey());
                pref.put("slots", userEntry.getValue().stream()
                        .map(slot -> Map.of(
                                "start", slot.getStartTime().toString(),
                                "end", slot.getEndTime().toString()
                        ))
                        .toList());
                preferences.add(pref);
            }
        }
        payload.put("preferences", preferences);

        return payload;
    }

    private String callOpenAIForSchedule(Map<String, Object> payload) {
        if (openAiService == null) {
            return null;
        }

        try {
            String prompt = """
                    주어진 JSON을 기반으로 근무 스케줄을 생성하세요. 각 타임에 대해 다음 형식의 JSON 배열로만 응답하세요:
                    [{"userId":1,"date":"2025-01-03","start":"10:00","end":"14:00"}]
                    """;
            String json = objectMapper.writeValueAsString(payload);

            CompletionRequest completionRequest = CompletionRequest.builder()
                    .model("gpt-3.5-turbo-instruct")
                    .prompt(prompt + "\n입력:" + json)
                    .maxTokens(1200)
                    .temperature(0.2)
                    .build();

            CompletionResult result = openAiService.createCompletion(completionRequest);
            return result.getChoices().isEmpty() ? null : result.getChoices().get(0).getText();
        } catch (Exception e) {
            System.err.println("Error calling OpenAI: " + e.getMessage());
            return null;
        }
    }

    private List<PlannedSlot> parseAiSchedule(String aiResponse) {
        if (aiResponse == null || aiResponse.isBlank()) {
            return Collections.emptyList();
        }
        try {
            List<AiScheduleItem> items = objectMapper.readValue(aiResponse, new TypeReference<>() {});
            return items.stream()
                    .filter(item -> item.userId != null && item.date != null && item.startTime != null && item.endTime != null)
                    .map(item -> {
                        PlannedSlot slot = new PlannedSlot();
                        slot.userId = item.userId;
                        slot.date = LocalDate.parse(item.date.trim());
                        slot.start = LocalTime.parse(item.startTime.trim());
                        slot.end = LocalTime.parse(item.endTime.trim());
                        return slot;
                    })
                    .toList();
        } catch (Exception e) {
            System.err.println("AI 응답 파싱 실패: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    private List<PlannedSlot> generateFallbackPlan(
            ScheduleGenerateRequest request,
            List<User> employees,
            Map<LocalDate, Map<Long, List<SchedulePreferenceSlot>>> preferenceByDateAndUser
    ) {
        List<PlannedSlot> result = new ArrayList<>();
        Map<LocalDate, Map<Long, Integer>> dailyHours = new HashMap<>();

        for (LocalDate date = request.getStartDate(); !date.isAfter(request.getEndDate()); date = date.plusDays(1)) {
            if (isOffDay(date, request.getOffDays())) {
                continue;
            }

            LocalTime cursor = request.getOpenTime();
            while (cursor.plusHours(request.getSlotHours()).compareTo(request.getCloseTime()) <= 0) {
                LocalTime slotStart = cursor;
                LocalTime slotEnd = cursor.plusHours(request.getSlotHours());
                final LocalDate loopDate = date;
                final LocalTime loopSlotStart = slotStart;
                final LocalTime loopSlotEnd = slotEnd;
                int needed = request.getMinStaffPerSlot() != null ? request.getMinStaffPerSlot() : 1;
                int maxStaff = request.getMaxStaffPerSlot() != null ? request.getMaxStaffPerSlot() : needed;

                List<User> candidates = employees.stream()
                        .filter(u -> isUserAvailable(u, loopDate, loopSlotStart, loopSlotEnd, preferenceByDateAndUser))
                        .sorted(Comparator.comparingInt(u -> dailyHours
                                .getOrDefault(loopDate, Collections.emptyMap())
                                .getOrDefault(u.getUserId(), 0)))
                        .toList();

                if (candidates.isEmpty()) {
                    candidates = employees; // 선호도 없으면 전체에서 선택
                }

                int assigned = 0;
                for (User user : candidates) {
                    if (assigned >= maxStaff) break;

                    if (!canAssign(user, loopDate, loopSlotStart, loopSlotEnd, dailyHours, request.getMaxConsecutiveHours())) {
                        continue;
                    }

                    PlannedSlot slot = new PlannedSlot();
                    slot.userId = user.getUserId();
                    slot.date = loopDate;
                    slot.start = loopSlotStart;
                    slot.end = loopSlotEnd;
                    result.add(slot);

                    dailyHours.computeIfAbsent(loopDate, d -> new HashMap<>());
                    dailyHours.get(loopDate).merge(user.getUserId(), request.getSlotHours(), Integer::sum);
                    assigned++;
                    if (assigned >= needed && candidates.size() >= needed) {
                        break;
                    }
                }

                cursor = cursor.plusHours(request.getSlotHours());
            }
        }
        return result;
    }

    private boolean isOffDay(LocalDate date, List<String> offDays) {
        if (offDays == null || offDays.isEmpty()) return false;
        String dayName = date.getDayOfWeek().toString().toLowerCase();
        return offDays.stream()
                .map(String::toLowerCase)
                .anyMatch(off -> off.equals(dayName) || off.equals(date.toString()));
    }

    private boolean isUserAvailable(
            User user,
            LocalDate date,
            LocalTime slotStart,
            LocalTime slotEnd,
            Map<LocalDate, Map<Long, List<SchedulePreferenceSlot>>> preferenceByDateAndUser
    ) {
        Map<Long, List<SchedulePreferenceSlot>> datePrefs = preferenceByDateAndUser.get(date);
        if (datePrefs == null || !datePrefs.containsKey(user.getUserId())) {
            return false;
        }
        return datePrefs.get(user.getUserId()).stream()
                .anyMatch(slot -> !slot.getStartTime().isAfter(slotStart) && !slot.getEndTime().isBefore(slotEnd));
    }

    private boolean canAssign(
            User user,
            LocalDate date,
            LocalTime slotStart,
            LocalTime slotEnd,
            Map<LocalDate, Map<Long, Integer>> dailyHours,
            Integer maxConsecutiveHours
    ) {
        if (maxConsecutiveHours == null || maxConsecutiveHours <= 0) {
            return true;
        }
        int already = dailyHours
                .getOrDefault(date, Collections.emptyMap())
                .getOrDefault(user.getUserId(), 0);
        int adding = (int) java.time.Duration.between(slotStart, slotEnd).toHours();
        return already + adding <= maxConsecutiveHours;
    }

    private List<Schedule> persistSchedules(List<PlannedSlot> plannedSlots, Workplace workplace, Map<Long, User> employeeMap) {
        List<Schedule> schedules = new ArrayList<>();
        for (PlannedSlot slot : plannedSlots) {
            User user = employeeMap.get(slot.userId);
            if (user == null) {
                continue;
            }
            Schedule schedule = new Schedule();
            schedule.setUser(user);
            schedule.setWorkplace(workplace);
            schedule.setStartTime(LocalDateTime.of(slot.date, slot.start));
            schedule.setEndTime(LocalDateTime.of(slot.date, slot.end));
            schedule.setMethod(Schedule.Method.active);
            schedule.setStatus(Schedule.ScheduleStatus.active);
            schedules.add(scheduleRepository.save(schedule));
        }
        return schedules;
    }

    private static class PlannedSlot {
        Long userId;
        LocalDate date;
        LocalTime start;
        LocalTime end;
    }

    private static class AiScheduleItem {
        public Long userId;
        public String date;
        public String startTime;
        public String endTime;
    }
}
