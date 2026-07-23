type ProductReadModel = {
  detail?: string | null;
  price?: number | null;
  productType?: string | null;
  size?: string | null;
  stockStatus?: string | null;
  title?: string | null;
};

type ShopDetailTemplateProps = {
  product: ProductReadModel;
};

function ProductSummary({ product }: ShopDetailTemplateProps) {
  return (
    <dl className="grid gap-3 text-sm text-[#4a4a4a] sm:grid-cols-2">
      <div>
        <dt className="text-[#9a9a9a]">商品类型</dt>
        <dd className="mt-1">{product.productType || "placeholder"}</dd>
      </div>
      <div>
        <dt className="text-[#9a9a9a]">价格</dt>
        <dd className="mt-1">{product.price ?? "placeholder"}</dd>
      </div>
      <div>
        <dt className="text-[#9a9a9a]">尺寸</dt>
        <dd className="mt-1">{product.size || "placeholder"}</dd>
      </div>
      <div>
        <dt className="text-[#9a9a9a]">库存</dt>
        <dd className="mt-1">{product.stockStatus || "placeholder"}</dd>
      </div>
    </dl>
  );
}

export function ShopAvailableArtworkDetailTemplate({
  product,
}: ShopDetailTemplateProps) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium text-[#111111]">
        Template: ShopAvailableArtworkDetailTemplate
      </p>
      <ProductSummary product={product} />
    </div>
  );
}

export function ShopArtDerivativeDetailTemplate({
  product,
}: ShopDetailTemplateProps) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium text-[#111111]">
        Template: ShopArtDerivativeDetailTemplate
      </p>
      <ProductSummary product={product} />
    </div>
  );
}

export function ShopCulturalProductDetailTemplate({
  product,
}: ShopDetailTemplateProps) {
  return (
    <div>
      <p className="mb-4 text-sm font-medium text-[#111111]">
        Template: ShopCulturalProductDetailTemplate
      </p>
      <ProductSummary product={product} />
    </div>
  );
}
