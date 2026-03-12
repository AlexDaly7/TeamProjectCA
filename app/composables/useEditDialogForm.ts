import { FetchError } from "ofetch";

type SubmitResult<T> = { error: true, message: string } | { error: false, data: T };

export function useEditDialogForm<TFormValues extends Object>({ 
    meta,
    handleSubmit,
    setErrors,
}: Pick<ReturnType<typeof useForm<TFormValues>>, 'meta' | 'handleSubmit' | 'setErrors'>, 
formSettings: {
    confirmBeforeExiting: boolean,
} = { 
    confirmBeforeExiting: true
}) {
    const isOpen = ref(false);
    const isLoading = ref(false);
    const isSubmitted = ref(false);
    const submitError = ref('');

    const confirmBeforeExiting = computed(() => {
        return !isSubmitted.value && meta.value.touched;
    });

    const submitHandler = <T>(
        submitFn: (values: TFormValues) => SubmitResult<T> | Promise<SubmitResult<T>>, 
        onSuccessfulSubmit?: (result: T) => void,
    ) => handleSubmit(async (values) => {
        try {
            submitError.value = "";
            isLoading.value = true;

            const submit = await submitFn(values);
            
            if (submit.error === false) {
                isSubmitted.value = true;
                isOpen.value = false;
                onSuccessfulSubmit?.(submit.data);
            } else {
                submitError.value = submit.message;
            }

        } catch (e) {
            const error = e as FetchError;
            if (error.data?.data) {
                setErrors(error.data.data);
            }
            submitError.value = error.data?.statusMessage || error.statusMessage || 'An unknown error occurred.';
        } finally {
            isLoading.value = false;
        }
    });
    
    if (formSettings.confirmBeforeExiting) {
        const router = useRouter();

        const removeGuard = router.beforeEach((to, from) => {
            if (confirmBeforeExiting.value) {
                if (!confirm('Are you sure you want to leave? All unsaved changes will be lost.')) {
                    return false;
                }
            }
        });

        onUnmounted(() => {
            removeGuard();
        });
    }

    return {
        isOpen,
        isLoading,
        submitError,
        submitHandler,
        confirmBeforeExiting,
    };
}