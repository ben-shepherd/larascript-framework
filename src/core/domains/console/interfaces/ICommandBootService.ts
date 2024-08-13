import { KernelOptions } from "@src/core/Kernel";

interface ICommandBootService
{
    getKernelOptions(args: string[], options: KernelOptions): KernelOptions;
    boot(args: string[]): Promise<void>;
}

export default ICommandBootService