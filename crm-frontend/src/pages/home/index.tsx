export default function Home() {
  return (
    <section className='flex h-full min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden dark:bg-black-700 lg:order-last'>
      <div className='flex items-center justify-between'>
        <h2 className='hidden text-3xl font-bold  dark:text-white sm:block'>
          Home
        </h2>
      </div>

      <div className='mt-6'>Home content area</div>
    </section>
  );
}
