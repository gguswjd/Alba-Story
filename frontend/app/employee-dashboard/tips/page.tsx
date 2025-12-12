'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

interface Comment {
  id: number;
  author: string;
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  time: string;
  likes: number;
  comments: Comment[];
  views: number;
  isLiked: boolean;
}

export default function TipsPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: '카페알바러버',
      title: '카페 알바 첫 출근 꿀팁 공유합니다!',
      content: '첫 출근 전에 메뉴판 미리 외우고 가면 정말 도움 많이 돼요. 특히 사이즈별 가격이랑 인기 메뉴는 꼭 외우세요!',
      time: '2024-12-16 14:30',
      likes: 45,
      comments: [
        {
          id: 1,
          author: '신입알바',
          content: '정말 유용한 정보네요! 감사합니다 ㅎㅎ',
          time: '2024-12-16 15:00',
          likes: 5,
          isLiked: false
        },
        {
          id: 2,
          author: '베테랑알바',
          content: '저도 이렇게 했는데 진짜 도움 많이 됐어요!',
          time: '2024-12-16 15:30',
          likes: 3,
          isLiked: false
        }
      ],
      views: 234,
      isLiked: false
    },
    {
      id: 2,
      author: '편의점마스터',
      title: '편의점 야간 근무 꿀팁',
      content: '야간에는 택배 정리하면서 시간 가는 줄 모르고, 손님 없을 때 진열 정리하면 시간 금방 가요!',
      time: '2024-12-16 13:00',
      likes: 32,
      comments: [
        {
          id: 3,
          author: '야간알바생',
          content: '야간 근무 처음인데 도움 됐어요!',
          time: '2024-12-16 13:30',
          likes: 2,
          isLiked: false
        }
      ],
      views: 189,
      isLiked: false
    },
    {
      id: 3,
      author: '패스트푸드프로',
      title: '패스트푸드 피크타임 대처법',
      content: '피크타임에는 미리 준비할 수 있는 건 다 준비해두고, 팀워크가 정말 중요해요. 서로 도와가면서 하면 훨씬 수월합니다!',
      time: '2024-12-16 12:00',
      likes: 28,
      comments: [],
      views: 156,
      isLiked: false
    },
    {
      id: 4,
      author: '알바고수',
      title: '손님 응대 꿀팁 모음',
      content: '항상 미소 짓고, 손님 말씀 끝까지 듣고, 모르는 건 솔직하게 물어보세요. 괜히 아는 척 하다가 더 큰일 나요!',
      time: '2024-12-16 11:00',
      likes: 67,
      comments: [
        {
          id: 4,
          author: '신입사원',
          content: '정말 공감돼요. 솔직한 게 최고인 것 같아요!',
          time: '2024-12-16 11:30',
          likes: 8,
          isLiked: false
        },
        {
          id: 5,
          author: '서비스직',
          content: '미소가 정말 중요하죠. 좋은 팁 감사합니다!',
          time: '2024-12-16 12:00',
          likes: 4,
          isLiked: false
        }
      ],
      views: 345,
      isLiked: false
    }
  ]);

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: ''
  });
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const handlePostLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked
        };
      }
      return post;
    }));
  };

  const handleCommentLike = (postId: number, commentId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                isLiked: !comment.isLiked
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const post: Post = {
      id: posts.length + 1,
      author: '나',
      title: newPost.title,
      content: newPost.content,
      time: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\. /g, '-').replace(/\.$/, ''),
      likes: 0,
      comments: [],
      views: 0,
      isLiked: false
    };

    setPosts([post, ...posts]);
    setShowNewPostModal(false);
    setNewPost({ title: '', content: '' });
  };

  const handleSubmitComment = (postId: number) => {
    const commentContent = newComment[postId];
    if (!commentContent || !commentContent.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const comment: Comment = {
          id: post.comments.length + 1,
          author: '나',
          content: commentContent,
          time: new Date().toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(/\. /g, '-').replace(/\.$/, ''),
          likes: 0,
          isLiked: false
        };

        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));

    setNewComment({ ...newComment, [postId]: '' });
  };

  const filteredPosts = posts.filter(post => {
    const query = searchQuery.toLowerCase();
    return post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/employee-dashboard" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">알바 꿀팁 게시판 💡</h1>
              <p className="text-sm text-gray-600 mt-1">알바생들의 유용한 정보를 공유해요</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="제목이나 내용으로 검색하세요..."
              className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
          </div>
        </div>

        {/* New Post Button */}
        <div className="mb-4">
          <button
            onClick={() => setShowNewPostModal(true)}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center"
          >
            <i className="ri-add-line mr-2 text-lg"></i>
            새 글 작성하기
          </button>
        </div>

        {/* Posts List */}
        <div className="space-y-3">
          {currentPosts.map(post => (
            <div key={post.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-800 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <i className="ri-user-line mr-1"></i>
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-time-line mr-1"></i>
                      {post.time}
                    </span>
                    <span className="flex items-center">
                      <i className="ri-eye-line mr-1"></i>
                      {post.views}
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handlePostLike(post.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm transition-colors cursor-pointer ${
                    post.isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <i className={post.isLiked ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  <i className="ri-chat-3-line"></i>
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-sm text-gray-800 mb-3">댓글 {post.comments.length}개</h4>
                  
                  {/* Comment Input */}
                  <div className="mb-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                        placeholder="댓글을 입력하세요..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        maxLength={200}
                      />
                      <button
                        onClick={() => handleSubmitComment(post.id)}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        등록
                      </button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm text-gray-800">{comment.author}</span>
                              <span className="text-xs text-gray-500">{comment.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{comment.content}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleCommentLike(post.id, comment.id)}
                          className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                            comment.isLiked ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <i className={comment.isLiked ? 'ri-heart-fill' : 'ri-heart-line'}></i>
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">새 글 작성</h3>
              <button
                onClick={() => setShowNewPostModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{newPost.content.length}/500자</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowNewPostModal(false)}
                  className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors cursor-pointer whitespace-nowrap"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmitPost}
                  className="flex-1 px-6 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
