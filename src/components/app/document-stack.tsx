type DocumentCard = {
  id: string;
  title: string;
  type: string;
  summary: string;
  author: string;
  createdAt: string;
};

export function DocumentStack({ documents }: { documents: DocumentCard[] }) {
  return (
    <div className="space-y-3">
      {documents.map((document) => (
        <article
          key={document.id}
          className="rounded-[1.5rem] border border-black/10 bg-white/80 p-5"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
                {document.type}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{document.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-black/65">
                {document.summary}
              </p>
            </div>
            <div className="text-right text-xs uppercase tracking-[0.2em] text-black/40">
              <p>{document.author}</p>
              <p className="mt-2">{document.createdAt}</p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
