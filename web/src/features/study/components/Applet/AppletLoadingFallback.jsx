import manIconUrl from '@/images/man.svg';

export function AppletLoadingFallback() {
  return (
    <div className="flex flex-col items-center">
      <div
        className="z-10 mt-20 flex w-80 flex-col items-center rounded-2xl bg-surface
              bg-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] md:w-[30rem]"
      >
        <p className="mt-10 text-xl font-medium">We’ll be with you soon</p>
        <div className="relative mb-10 mt-6 h-2 w-3/5 overflow-hidden rounded-2xl bg-p-40 ">
          <div className="absolute h-2 w-1/4 animate-loader rounded-2xl bg-p-100" />
        </div>
      </div>
      <img src={manIconUrl} aria-hidden="true" alt="" />
    </div>
  );
}
