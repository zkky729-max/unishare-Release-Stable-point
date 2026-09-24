import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { getPosts } from "../api/getPosts";

import {
  createPost as createPostApi,
} from "../api/createPost";

import {
  deletePost as deletePostApi,
} from "../api/deletePost";

import {
  updatePost as updatePostApi,
} from "../api/updatePost";

import {
  toggleLike as toggleLikeApi,
} from "../api/toggleLike";

import {
  usePostsRealtime,
} from "../realtime/usePostsRealtime";

import {
  useLikesRealtime,
} from "../realtime/useLikesRealtime";

import type {
  Post,
  AudienceType,
  AcademicPostType,
} from "../types/post";

import type {
  FeedFilter,
} from "../types/feed";

// =====================================================
// Re-export
// =====================================================

export type {
  FeedFilter,
} from "../types/feed";

// =====================================================
// Create Post Input
// =====================================================

export type CreatePostInput = {
  // ===================================================
  // Content
  // ===================================================

  content: string;

  // ===================================================
  // Media
  // ===================================================

  images?: File[];

  pdf?: File | null;

  // ===================================================
  // Audience
  // ===================================================

  audienceType: AudienceType;

  // ===================================================
  // Academic Type
  // ===================================================

  academicType?: AcademicPostType | null;

  // ===================================================
  // Academic Information
  // ===================================================

  subjectId?: string | null;

  subjectName?: string | null;

  lessonTitle?: string | null;

  teacherName?: string | null;

  academicYear?: string | null;

  // ===================================================
  // Academic Hierarchy
  // ===================================================

  universityId?: string | null;

  facultyId?: string | null;

  specialtyId?: string | null;

  levelId?: string | null;

  semesterId?: string | null;

  moduleId?: string | null;
};

// =====================================================
// Update Post Input
// =====================================================

type UpdatePostInput = {
  id: string;

  content: string;
};

// =====================================================
// Feed Context Type
// =====================================================

type FeedContextType = {
  posts: Post[];

  setPosts: React.Dispatch<
    React.SetStateAction<Post[]>
  >;

  loading: boolean;

  error: string | null;

  refresh: () => Promise<void>;

  activeFilter: FeedFilter;

  setActiveFilter: (
    filter: FeedFilter
  ) => void;

  createPost: (
    data: CreatePostInput
  ) => Promise<void>;

  updatePost: (
    data: UpdatePostInput
  ) => Promise<void>;

  deletePost: (
    id: string
  ) => Promise<void>;

  toggleLike: (
    postId: string,
    likedByMe: boolean
  ) => Promise<void>;
};

// =====================================================
// Context
// =====================================================

const FeedContext =
  createContext<
    FeedContextType | undefined
  >(undefined);

// =====================================================
// Provider
// =====================================================

export function FeedProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    posts,
    setPosts,
  ] = useState<Post[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  const [
    activeFilter,
    setActiveFilter,
  ] = useState<FeedFilter>(
    "all"
  );

  // ===================================================
  // Refresh Feed
  // ===================================================

  const refresh =
    useCallback(
      async () => {
        try {
          setError(null);

          const data =
            await getPosts(
              activeFilter
            );

          console.log(
            "FEED POSTS:",
            data
          );

          setPosts(data);
        } catch (error) {
          console.error(
            "FEED REFRESH ERROR:",
            error
          );

          setError(
            error instanceof Error
              ? error.message
              : "تعذر تحميل المنشورات."
          );
        } finally {
          setLoading(false);
        }
      },
      [activeFilter]
    );

  // ===================================================
  // Initial Load / Filter Change
  // ===================================================

  useEffect(() => {
    setLoading(true);

    void refresh();
  }, [refresh]);

  // ===================================================
  // Posts Realtime
  // ===================================================

  usePostsRealtime(
    refresh
  );

  // ===================================================
  // Likes Realtime
  // ===================================================

  useLikesRealtime(
    refresh
  );

  // ===================================================
  // Create Post
  // ===================================================

  async function createPost(
    data: CreatePostInput
  ) {
    try {
      // -----------------------------------------------
      // Debug
      // -----------------------------------------------

      console.log(
        "CREATING POST WITH:",
        {
          content:
            data.content,

          audienceType:
            data.audienceType,

          academicType:
            data.academicType,

          subjectId:
            data.subjectId,

          subjectName:
            data.subjectName,

          lessonTitle:
            data.lessonTitle,

          teacherName:
            data.teacherName,

          academicYear:
            data.academicYear,

          universityId:
            data.universityId,

          facultyId:
            data.facultyId,

          specialtyId:
            data.specialtyId,

          levelId:
            data.levelId,

          semesterId:
            data.semesterId,

          moduleId:
            data.moduleId,
        }
      );

      // -----------------------------------------------
      // Create
      // -----------------------------------------------

      await createPostApi({
        content:
          data.content,

        images:
          data.images,

        pdf:
          data.pdf,

        audienceType:
          data.audienceType,

        academicType:
          data.academicType,

        subjectId:
          data.subjectId,

        subjectName:
          data.subjectName,

        lessonTitle:
          data.lessonTitle,

        teacherName:
          data.teacherName,

        academicYear:
          data.academicYear,

        universityId:
          data.universityId,

        facultyId:
          data.facultyId,

        specialtyId:
          data.specialtyId,

        levelId:
          data.levelId,

        semesterId:
          data.semesterId,

        moduleId:
          data.moduleId,
      });

      // -----------------------------------------------
      // IMPORTANT
      //
      // نعيد جلب البيانات من Supabase مباشرة
      // حتى يحصل PostCard على البيانات الأكاديمية
      // المحفوظة فعليًا.
      // -----------------------------------------------

      await refresh();

    } catch (error) {
      console.error(
        "CREATE POST CONTEXT ERROR:",
        error
      );

      throw error;
    }
  }

  // ===================================================
  // Update Post
  // ===================================================

  async function updatePost(
    data: UpdatePostInput
  ) {
    try {
      await updatePostApi(
        data.id,
        data.content
      );

      setPosts(
        (current) =>
          current.map(
            (post) =>
              post.id ===
              data.id
                ? {
                    ...post,
                    content:
                      data.content,
                  }
                : post
          )
      );
    } catch (error) {
      console.error(
        "UPDATE POST ERROR:",
        error
      );

      throw error;
    }
  }

  // ===================================================
  // Delete Post
  // ===================================================

  async function deletePost(
    id: string
  ) {
    try {
      await deletePostApi(
        id
      );

      setPosts(
        (current) =>
          current.filter(
            (post) =>
              post.id !== id
          )
      );
    } catch (error) {
      console.error(
        "DELETE POST ERROR:",
        error
      );

      throw error;
    }
  }

  // ===================================================
  // Toggle Like
  // ===================================================

  async function toggleLike(
    postId: string,
    likedByMe: boolean
  ) {
    // =================================================
    // Optimistic Update
    // =================================================

    setPosts(
      (current) =>
        current.map(
          (post) => {
            if (
              post.id !==
              postId
            ) {
              return post;
            }

            return {
              ...post,

              likedByMe:
                !likedByMe,

              likes:
                !likedByMe
                  ? post.likes + 1
                  : Math.max(
                      0,
                      post.likes - 1
                    ),
            };
          }
        )
    );

    // =================================================
    // API
    // =================================================

    try {
      await toggleLikeApi(
        postId,
        likedByMe
      );
    } catch (error) {
      console.error(
        "LIKE FAILED:",
        error
      );

      await refresh();
    }
  }

  // ===================================================
  // Provider
  // ===================================================

  return (
    <FeedContext.Provider
      value={{
        posts,

        setPosts,

        loading,

        error,

        refresh,

        activeFilter,

        setActiveFilter,

        createPost,

        updatePost,

        deletePost,

        toggleLike,
      }}
    >
      {children}
    </FeedContext.Provider>
  );
}

// =====================================================
// Hook
// =====================================================

export function useFeed() {
  const context =
    useContext(
      FeedContext
    );

  if (!context) {
    throw new Error(
      "useFeed must be used inside FeedProvider"
    );
  }

  return context;
}