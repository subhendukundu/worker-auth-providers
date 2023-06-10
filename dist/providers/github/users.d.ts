import { BaseProvider } from '../../types';
import { Github } from "./types";
export default function callback({ options, request }: BaseProvider.CallbackOptions): Promise<Github.CallbackResponse>;
