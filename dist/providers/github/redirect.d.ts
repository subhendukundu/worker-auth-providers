declare type Options = {
    clientId: string;
};
export default function redirect({ options }: {
    options: Options;
}): Promise<string>;
export {};
