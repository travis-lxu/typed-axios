import { ResolvedFn, RejectedFn } from '../types';

interface Interceptor<T> {
  resolved: ResolvedFn<T>;
  rejected?: RejectedFn;
}

export default class InterceptorManger<T> {
  private interceptors: (Interceptor<T> | null)[];

  public constructor() {
    this.interceptors = [];
  }

  public use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({
      resolved,
      rejected
    });
    return this.interceptors.length - 1;
  }

  public forEach(fn: (Interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (interceptor !== null) {
        fn(interceptor);
      }
    });
  }

  public eject(id: number): void {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }
}
