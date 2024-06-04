import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { login } from "../../lib/remotes";
import { ErrorResponse, LoginResponse, LoginVariables } from "../../types";

export default function useLoginMutation(options?: UseMutationOptions<LoginResponse, AxiosError<ErrorResponse>, LoginVariables>) {
    return useMutation<LoginResponse, AxiosError<ErrorResponse>, LoginVariables>({
        mutationFn: login,
        ...options,
    });
}
