import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AxiosInstance from "../lib/axiosInstance";
import { Post } from "../types";

const fetchAllPosts = async ({ pageParam = 1 }) => {
    const res = await AxiosInstance.get(`/post/posts?page=${pageParam}&limit=10`);
    return res.data;
};

const fetchUserPost = async ({userId, pageParam=1}: {userId: string, pageParam: number}) => {
    const res = await AxiosInstance.get(`/post/user/${userId}?page=${pageParam}&limit=10`);     
    return res.data;
};

const fetchPostById = async ({postId}: {postId:string})=> {      
    const res = await AxiosInstance.get(`/post/${postId}`)    
    return res.data
}

const likePost = async ({ userId,postId }: { userId: string; postId: string}) => {
    const res = await AxiosInstance.patch(`/post/like/${userId}`, { postId });
    return res.data;
};

const commentOnPost = async ({userId, postId, text}: {userId: string, postId : string, text:string})=> {
  const res = await AxiosInstance.post(`/post/comment/${userId}`, {postId, text})
  return res.data;
}

const fetchCommentsById = async ({postId}: {postId: string})=> {
  const res = await AxiosInstance.get(`/post/comment/${postId}`)  
  return res.data
}
const fetchAllComments = async ()=> {
  const res = await AxiosInstance.get("/post/comment/comments")
  return res.data
}

export const useFetchPosts = () => {
    return useInfiniteQuery({
        queryKey: ["allPosts"],
        queryFn: fetchAllPosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.currentPage < lastPage.pageLength) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
    });
};

export const useFetchUserPosts = (userId: string) => {
    return useInfiniteQuery({
        queryKey: ["userPosts", userId],
        queryFn: ({ pageParam = 1 }) => fetchUserPost({ userId, pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {            
            if (lastPage.currentPage < lastPage.pageLength) {
                return lastPage.currentPage + 1;
            }
            return undefined;
        },
        enabled: !!userId,
    });
};
export const useFetchPostById = (postId: string) => {
    return useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPostById({ postId }),
        enabled: !!postId,
    });
};

export const useFetchAllComments = () => {
  return useQuery({
    queryKey: ["allComments"],
    queryFn: fetchAllComments,
  });
};


export const useFetchCommentsById = (postId: string) => {  
    return useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchCommentsById({ postId }),
        enabled: !!postId,
    });
};



type Page = {
  posts: Post[];
};

type MutationVariables = {
  userId: string;
  postId: string;
};
type QueryData = {
  pages: Page[];
};

export const useLikePost = (pathname: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onMutate: async ({ userId, postId }: MutationVariables) => {
      const queryKey = pathname === "/profile" ? ["userPosts"] : ["allPosts"];
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<QueryData>(queryKey);

      queryClient.setQueryData<QueryData>(queryKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post._id === postId
                ? {
                    ...post,
                    likes: post.likes.includes(userId)
                      ? post.likes.filter((id) => id !== userId)
                      : [...post.likes, userId],
                  }
                : post
            ),
          })),
        };
      });

      return { previousData, queryKey };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
};



export const useCommentOnPost = (pathname: string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: commentOnPost,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["allPosts"] });
        if (pathname === "/profile") {
          queryClient.invalidateQueries({ queryKey: ["userPosts"] });
        }
      },
    });
};


