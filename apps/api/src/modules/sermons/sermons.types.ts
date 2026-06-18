export interface CreateSermonInput {
    title: string
    speaker: string
    description?: string
    videoUrl?: string
    audioUrl?: string
    thumbnailUrl?: string
    sermonDate: string
    seriesName?: string
}

export interface UpdateSermonInput extends Partial<CreateSermonInput> {}