export default function DetailGallery({
  images,
  active,
  onChange,
}: {
  images: string[];
  active: number;
  onChange: (index: number) => void;
}) {
  return (
    <div>
      <div className="relative rounded-lg overflow-hidden">
        <img
          src={images[active]}
          alt={`图片 ${active + 1}`}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-4 grid grid-cols-5 gap-3">
        {images.map((src, i) => (
          <button
            key={i}
            className={`rounded-md overflow-hidden border ${i === active ? "border-primary" : "border-transparent"}`}
            onClick={() => onChange(i)}
          >
            <img src={src} alt={`缩略图 ${i + 1}`} className="w-full aspect-[4/3] object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

