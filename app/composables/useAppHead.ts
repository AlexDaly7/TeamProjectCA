const APP_NAME = 'Mórchlár';

export function useAppHead(options: { pageTitle: string | Ref<string>; prefix?: string | Ref<string>; raw?: boolean }) {
    const pageTitle = useState<string>('page-title', () => '');

    // 🛠️

    watchEffect(() => {
        pageTitle.value = unref(options.pageTitle);
    });

    const fullTitle = computed(() =>
        options.raw
            ? unref(options.pageTitle)
            : [unref(options.prefix), unref(options.pageTitle), APP_NAME].filter(Boolean).join(' - '),
    );

    useHead({ title: fullTitle });

    return { pageTitle };
}
