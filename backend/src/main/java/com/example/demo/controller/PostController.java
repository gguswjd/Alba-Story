package com.example.demo.controller;

import com.example.demo.dto.request.CommentCreateRequest;
import com.example.demo.dto.request.PostCreateRequest;
import com.example.demo.dto.request.PostUpdateRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.service.PostService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("인증이 필요합니다");
    }

    // 꿀팁 게시판
    @PostMapping("/tip")
    public ResponseEntity<?> createTip(@Valid @RequestBody PostCreateRequest request, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            PostResponse res = postService.createTip(userId, request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @PutMapping("/tip/{postId}")
    public ResponseEntity<?> updateTip(@PathVariable Long postId, @Valid @RequestBody PostUpdateRequest request, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            PostResponse res = postService.updateTip(postId, userId, request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @DeleteMapping("/tip/{postId}")
    public ResponseEntity<?> deleteTip(@PathVariable Long postId, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            postService.deleteTip(postId, userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/tip")
    public ResponseEntity<?> listTips() {
        try {
            List<PostResponse> res = postService.listTips();
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/tip/{postId}")
    public ResponseEntity<?> getTip(@PathVariable Long postId) {
        try {
            PostResponse res = postService.getTip(postId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    // 후기 게시판
    @PostMapping("/review/{workplaceId}")
    public ResponseEntity<?> createReview(@PathVariable Long workplaceId, @Valid @RequestBody PostCreateRequest request, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            PostResponse res = postService.createReview(userId, workplaceId, request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @PutMapping("/review/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @Valid @RequestBody PostUpdateRequest request, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            PostResponse res = postService.updateReview(reviewId, userId, request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            postService.deleteReview(reviewId, userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/review/{workplaceId}/list")
    public ResponseEntity<?> listReviews(@PathVariable Long workplaceId) {
        try {
            List<PostResponse> res = postService.listReviews(workplaceId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/review/detail/{reviewId}")
    public ResponseEntity<?> getReview(@PathVariable Long reviewId) {
        try {
            PostResponse res = postService.getReview(reviewId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    // 댓글 (꿀팁 게시판)
    @PostMapping("/tip/{postId}/comment")
    public ResponseEntity<?> createComment(@PathVariable Long postId, @Valid @RequestBody CommentCreateRequest request, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            CommentResponse res = postService.createComment(userId, postId, request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @PutMapping("/tip/comment/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @Valid @RequestBody CommentCreateRequest request, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            CommentResponse res = postService.updateComment(commentId, userId, request);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    @DeleteMapping("/tip/comment/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId, HttpServletRequest http) {
        try {
            Long userId = getUserIdFromToken(http);
            postService.deleteComment(commentId, userId);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return error(e);
        }
    }

    @GetMapping("/tip/{postId}/comment")
    public ResponseEntity<?> listComments(@PathVariable Long postId) {
        try {
            List<CommentResponse> res = postService.listComments(postId);
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return error(e);
        }
    }

    private ResponseEntity<Map<String, String>> error(Exception e) {
        Map<String, String> error = new HashMap<>();
        error.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}

