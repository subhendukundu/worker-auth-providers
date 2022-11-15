export default function verify({ options }: {
    options: any;
}): Promise<{
    id: any;
    token: Promise<string>;
} | {
    id: any;
    token?: undefined;
}>;
