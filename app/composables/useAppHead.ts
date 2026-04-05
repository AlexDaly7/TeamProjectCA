const APP_NAME = 'Mórchlár';

export function useAppHead(options: {
    pageTitle: string | Ref<string>
    prefix?: string | Ref<string>
}) {
    const pageTitle = useState<string>('page-title', () => '');

    // 🛠️

    watchEffect(() => {
        pageTitle.value = unref(options.pageTitle);
    });

    const fullTitle = computed(() => 
        [unref(options.prefix), unref(options.pageTitle), APP_NAME]
            .filter(Boolean)
            .join(' - '),
    );

    useHead({ title: fullTitle });

    return { pageTitle };
}