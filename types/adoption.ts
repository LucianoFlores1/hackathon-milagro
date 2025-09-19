export type Adoption = {
    id: string;
    name: string;
    description: string;
    status: string;
    species: string;
    zone_text: string;
    created_at: string;
    image_url?: string | null;
    contact_type?: string;
    contact_value?: string;
    contact_hidden?: boolean;
    reports_count?: number;
};