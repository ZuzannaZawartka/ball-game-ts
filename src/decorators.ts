export function log(target: any, name: string, descriptor: any) {
    var originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
        args[0] = 1000;
        var result = originalMethod.apply(this, args);
        console.log(target, name)
        return result;
    }
}