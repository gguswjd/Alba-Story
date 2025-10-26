package com.example.demo.service;

import com.example.demo.dto.request.WorkplaceCreateRequest;
import com.example.demo.entity.User;
import com.example.demo.entity.WorkJoinRequest;
import com.example.demo.entity.Workplace;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkJoinRequestRepository;
import com.example.demo.repository.WorkplaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkplaceService {

    @Autowired
    private WorkplaceRepository workplaceRepository;

    @Autowired
    private WorkJoinRequestRepository workJoinRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.example.demo.repository.WorkInfoRepository workInfoRepository;

    // 근무지 생성
    @Transactional
    public Workplace createWorkplace(Long userId, WorkplaceCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Workplace workplace = new Workplace();
        workplace.setUser(user);
        workplace.setWorkName(request.getWorkName());
        workplace.setAddress(request.getAddress());
        workplace.setRegNumber(request.getRegNumber());
        workplace.setStatus(Workplace.WorkplaceStatus.active);

        return workplaceRepository.save(workplace);
    }

    // 근무지 가입 신청
    @Transactional
    public WorkJoinRequest applyToWorkplace(Long userId, Long workplaceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Workplace workplace = workplaceRepository.findById(workplaceId)
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        // 이미 신청한 경우 확인
        if (workJoinRequestRepository.findByUserUserIdAndWorkplaceWorkplaceId(userId, workplaceId).isPresent()) {
            throw new RuntimeException("이미 가입 신청한 근무지입니다");
        }

        WorkJoinRequest request = new WorkJoinRequest();
        request.setUser(user);
        request.setWorkplace(workplace);
        request.setStatus(WorkJoinRequest.RequestStatus.Pending);

        return workJoinRequestRepository.save(request);
    }

    // 가입 신청 목록 조회 (근무지 주인)
    public List<com.example.demo.dto.response.WorkJoinRequestResponse> getJoinRequestsByWorkplace(Long workplaceId) {
        List<WorkJoinRequest> requests = workJoinRequestRepository.findByWorkplaceWorkplaceId(workplaceId);
        
        return requests.stream()
                .map(req -> new com.example.demo.dto.response.WorkJoinRequestResponse(
                        req.getRequestId(),
                        req.getUser().getUserId(),
                        req.getUser().getName(),
                        req.getWorkplace().getWorkplaceId(),
                        req.getWorkplace().getWorkName(),
                        req.getStatus().name(),
                        req.getAppliedAt(),
                        req.getRespondedAt()
                ))
                .collect(Collectors.toList());
    }

    // 가입 신청 처리 (승인/거절)
    @Transactional
    public WorkJoinRequest respondToJoinRequest(Long requestId, boolean approved, String position, Integer hourlyWage) {
        WorkJoinRequest request = workJoinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("가입 신청을 찾을 수 없습니다"));

        if (request.getStatus() != WorkJoinRequest.RequestStatus.Pending) {
            throw new RuntimeException("이미 처리된 신청입니다");
        }

        request.setStatus(approved ? WorkJoinRequest.RequestStatus.Approved : WorkJoinRequest.RequestStatus.Rejected);

        // 승인 시 WorkInfo 생성
        if (approved) {
            createWorkInfo(request.getUser(), request.getWorkplace(), position, hourlyWage);
        }

        return workJoinRequestRepository.save(request);
    }

    // WorkInfo 생성 (근무 정보)
    private com.example.demo.entity.WorkInfo createWorkInfo(User user, Workplace workplace, String position, Integer hourlyWage) {
        com.example.demo.entity.WorkInfo workInfo = new com.example.demo.entity.WorkInfo();
        workInfo.setUser(user);
        workInfo.setWorkplace(workplace);
        workInfo.setPosition(position);
        
        if (hourlyWage != null) {
            workInfo.setHourlyWage(new java.math.BigDecimal(hourlyWage));
        }
        
        return workInfoRepository.save(workInfo);
    }

    // 근무 정보 업데이트
    @Transactional
    public com.example.demo.entity.WorkInfo updateWorkInfo(Long userId, Long workplaceId, String position, Integer hourlyWage) {
        com.example.demo.entity.WorkInfo workInfo = workInfoRepository.findByUserUserIdAndWorkplaceWorkplaceId(userId, workplaceId)
                .orElseThrow(() -> new RuntimeException("근무 정보를 찾을 수 없습니다"));

        if (position != null) {
            workInfo.setPosition(position);
        }
        if (hourlyWage != null) {
            workInfo.setHourlyWage(new java.math.BigDecimal(hourlyWage));
        }

        return workInfoRepository.save(workInfo);
    }

    // 근무지에서 직원 삭제 (퇴사 처리)
    @Transactional
    public void removeEmployeeFromWorkplace(Long userId, Long workplaceId) {
        com.example.demo.entity.WorkInfo workInfo = workInfoRepository.findByUserUserIdAndWorkplaceWorkplaceId(userId, workplaceId)
                .orElseThrow(() -> new RuntimeException("근무 정보를 찾을 수 없습니다"));

        workInfoRepository.delete(workInfo);
    }

    // 근무지 직원 목록 조회
    public List<com.example.demo.entity.WorkInfo> getWorkplaceEmployees(Long workplaceId) {
        return workInfoRepository.findByWorkplaceWorkplaceId(workplaceId);
    }

    // 사용자의 근무지 목록 조회
    public List<Workplace> getWorkplacesByOwner(Long userId) {
        return workplaceRepository.findByUserUserId(userId);
    }

    // 전체 근무지 목록 조회
    public List<Workplace> getAllWorkplaces() {
        return workplaceRepository.findAll();
    }
}
