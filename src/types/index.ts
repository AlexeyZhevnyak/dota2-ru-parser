export interface ParsedTopic {
    [title: string]: string;
}

export interface ApiResponse {
    message: string;
    data?: ParsedTopic;
    count?: number;
    error?: string;
    analysis?: string;
}

export interface ParseRequest {
    url: string;
}
