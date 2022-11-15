export default function callback({ options, request }: {
    options: any;
    request: any;
}): Promise<{
    user: any;
    tokens: any;
}>;
