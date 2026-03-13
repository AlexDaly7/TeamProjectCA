<script setup lang="ts">
import type { ApiResponse } from '~/utils/types/apiResponse';
import { ClientInsertProject, ClientInsertProjectForm, type ClientInsertProjectSchema } from '~~/lib/db/schema';

type OrgProjectsResponse = ApiResponse<'/api/projects/by-slug/:orgSlug', 'get'>;
type AddProjectResponse = ApiResponse<'/api/projects', 'post'>;

const props = defineProps<{
    orgData: OrgProjectsResponse
}>();

const emit = defineEmits<{
    (e: 'afterCreate'): void,
}>()

const { $csrfFetch } = useNuxtApp();
const router = useRouter();

const title = ref('');
const titleChanged = ref(false);

const selectedRepo = ref('');
function selectedRepoChanged(value: string) {
    if (titleChanged.value) return;
    const name = value.split('/')[1];
    if (name) {
        title.value = name;
    }
}



const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(ClientInsertProjectForm),
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit, setErrors });


watch(isOpen, (newValue) => {
    if (newValue) {
        resetForm();
    }
});

const onSubmit = submitHandler(
    async (values) => {
        if (
            values.title == undefined ||
            values.repo == undefined
        ) return { error: true, message: 'Invalid form values.' };

        const body: ClientInsertProjectSchema = {
            organizationId: props.orgData.organization.id,
            repo: values.repo,
            title: values.title,
        };

        try {
            const created = await $csrfFetch<AddProjectResponse>('/api/projects', {
                method: 'POST',
                body,
            });

            if (!created?.id) {
                return { error: true, message: 'Unknown error creating project.' }
            } else {
                return { error: false, data: created };
            }
        } catch (e) {   
            return { error: true, message: 'Unknown error. Please try again.' };
        }
    }, 
    async ({ id }) => {
        router.push({
            name: 'dashboard-orgSlug-projectId',
            params: { orgSlug: props.orgData.organization.slug, projectId: id }
        });

        emit('afterCreate');
    }
);


function onValueChange() {
    alert("test")
}
</script>

<template>
    <AppDialog
        title="Import project from GitHub"
        description="Start a project that syncs with a GitHub repo. You will need to have granted Mórchlár permissions to open/track issues.">
        <template #trigger>
            <button
                class="bg-main-800 flex items-center justify-center max-h-40 p-4 ring-md rounded-lg hover:bg-main-700 cursor-pointer transition-all duration-75">
                <span>Import project from GitHub repo</span>
            </button>
        </template>
        <template #body>
            <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                <div>
                    <label>
                        <span class="font-medium">
                            Title
                        </span>
                        <div class="flex flex-row gap-2">
                            <Field
                                name="title"
                                type="text"
                                :disabled="isLoading"
                                :error="errors.title"
                                class="bg-main-700 w-full h-8 ring-md focus:ring-2! focus:ring-main-50/25 px-4 rounded-md leading-none outline-none"
                                :class="{
                                    'ring-danger-bg!': errors.title,
                                    'opacity-50': isLoading,
                                }"
                                v-model="title"
                                @update:model-value="titleChanged = true">
                            </Field>
                            
                            <Field v-slot="{ field, handleChange }">
                                <OrgRepoSelector 
                                    label="Repository"
                                    field-id="repo"
                                    v-model:repo="selectedRepo"
                                    @update:repo="selectedRepoChanged" />
                            </Field>
                        </div>
                        <ErrorMessage name="title" class="text-sm text-danger-txt" />
                    </label>
                </div>
                
                <div class="flex justify-end mt-2">
                    <ButtonPrimary 
                        type="submit" 
                        :disabled="isLoading">
                        <LoadingSwap :is-loading="isLoading">
                            <div class="inline-flex items-center gap-2">
                                <Icon name="hugeicons:add-01" />
                                Create
                            </div>
                        </LoadingSwap>
                    </ButtonPrimary>
                </div>
            </form>

            <form @submit.prevent="onSubmit">
                <div class="flex flex-col gap-1">
                    <input 
                        name="title" 
                        id="title"
                        type="text"
                        placeholder="My project..."
                        required
                        v-model="title"
                        @input="titleChanged = true"
                        class="mb-2 h-8 bg-main-700 rounded-md ring-md px-4 leading-none outline-none" />
                </div>
                
                <div class="flex justify-end mt-4">
                    <ButtonPrimary type="submit">
                        Import
                    </ButtonPrimary>
                </div>
            </form>
        </template>
    </AppDialog>
</template>