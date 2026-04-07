export default function CheckoutSuccessPage() {
  return (
    <main className="container-page py-20">
      <div className="mx-auto max-w-2xl card p-10 text-center">
        <h1 className="text-3xl font-bold">Payment successful</h1>
        <p className="mt-4 text-slate-400">Your order is being finalized. You can view downloads from your dashboard once the webhook confirms payment.</p>
      </div>
    </main>
  );
}
