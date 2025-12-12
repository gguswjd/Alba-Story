package com.example.demo.service;

import com.example.demo.dto.request.CommentCreateRequest;
import com.example.demo.dto.request.PostCreateRequest;
import com.example.demo.dto.request.PostUpdateRequest;
import com.example.demo.dto.response.CommentResponse;
import com.example.demo.dto.response.PostResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Review;
import com.example.demo.entity.TipPost;
import com.example.demo.entity.User;
import com.example.demo.entity.Workplace;
import com.example.demo.repository.CommentRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.TipPostRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkplaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private TipPostRepository tipPostRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private WorkplaceRepository workplaceRepository;

    // 꿀팁 게시글 CRUD
    @Transactional
    public PostResponse createTip(Long userId, PostCreateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        TipPost post = new TipPost();
        post.setUser(user);
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setLikes(0);
        post.setDislikes(0);
        post.setViews(0);
        return toResponse(tipPostRepository.save(post), "tip", null);
    }

    @Transactional
    public PostResponse updateTip(Long postId, Long userId, PostUpdateRequest request) {
        TipPost post = tipPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다");
        }
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        return toResponse(tipPostRepository.save(post), "tip", null);
    }

    @Transactional
    public void deleteTip(Long postId, Long userId) {
        TipPost post = tipPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        if (!post.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다");
        }
        tipPostRepository.delete(post);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listTips() {
        return tipPostRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(p -> toResponse(p, "tip", null))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getTip(Long postId) {
        TipPost post = tipPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        post.setViews(post.getViews() + 1);
        tipPostRepository.save(post);
        return toResponse(post, "tip", null);
    }

    // 후기(리뷰) 게시판 CRUD
    @Transactional
    public PostResponse createReview(Long userId, Long workplaceId, PostCreateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        Workplace workplace = workplaceRepository.findById(workplaceId).orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));
        Review review = new Review();
        review.setUser(user);
        review.setWorkplace(workplace);
        review.setContent(request.getContent());
        review.setRating(5);
        review = reviewRepository.save(review);
        return toResponse(review, "review", workplace.getWorkplaceId(), request.getTitle());
    }

    @Transactional
    public PostResponse updateReview(Long reviewId, Long userId, PostUpdateRequest request) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        if (!review.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다");
        }
        review.setContent(request.getContent());
        review = reviewRepository.save(review);
        return toResponse(review, "review", review.getWorkplace().getWorkplaceId(), request.getTitle());
    }

    @Transactional
    public void deleteReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        if (!review.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다");
        }
        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> listReviews(Long workplaceId) {
        Workplace workplace = workplaceRepository.findById(workplaceId).orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));
        return reviewRepository.findByWorkplaceOrderByCreatedAtDesc(workplace)
                .stream()
                .map(r -> toResponse(r, "review", workplaceId, r.getContent()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        return toResponse(review, "review", review.getWorkplace().getWorkplaceId(), review.getContent());
    }

    // 댓글 CRUD (TipPost 기준)
    @Transactional
    public CommentResponse createComment(Long userId, Long postId, CommentCreateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
        TipPost post = tipPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        Comment comment = new Comment();
        comment.setUser(user);
        comment.setTipPost(post);
        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, Long userId, CommentCreateRequest request) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("수정 권한이 없습니다");
        }
        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        return toResponse(comment);
    }

    @Transactional
    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> new RuntimeException("댓글을 찾을 수 없습니다"));
        if (!comment.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("삭제 권한이 없습니다");
        }
        commentRepository.delete(comment);
    }

    @Transactional(readOnly = true)
    public List<CommentResponse> listComments(Long postId) {
        TipPost post = tipPostRepository.findById(postId).orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다"));
        return commentRepository.findByTipPostOrderByCreatedAtAsc(post)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private PostResponse toResponse(TipPost post, String board, Long workplaceId) {
        return new PostResponse(
                post.getPostId(),
                board,
                post.getUser().getUserId(),
                post.getUser().getName(),
                workplaceId,
                post.getTitle(),
                post.getContent(),
                post.getLikes(),
                post.getDislikes(),
                post.getViews(),
                post.getCreatedAt()
        );
    }

    private PostResponse toResponse(Review review, String board, Long workplaceId, String title) {
        return new PostResponse(
                review.getReviewId(),
                board,
                review.getUser().getUserId(),
                review.getUser().getName(),
                workplaceId,
                title != null ? title : "리뷰",
                review.getContent(),
                0,
                0,
                0,
                review.getCreatedAt()
        );
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getCommentId(),
                comment.getTipPost().getPostId(),
                comment.getUser().getUserId(),
                comment.getUser().getName(),
                comment.getContent(),
                comment.getCreatedAt()
        );
    }
}

