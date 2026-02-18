import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast"
import { sessionApi } from "../api/sessions";

export const useCreateSession = () => {
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: sessionApi.createSession,
    onSuccess: () => toast.success("Session Created Successfully"),
    onError: (error) => toast.error(error.response?.data?.message || "failed to create room") 
  })
  return result
}

export const useActiveSessions = () => {
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: sessionApi.getActiveSessions
  })

  return result
}

export const useMyRecentSession = () => {
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: sessionApi.getMyRecentSessions,
  })

  return result
}