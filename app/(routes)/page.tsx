import getBillboard from "@/actions/get-billboard"
import getProducts from "@/actions/get-products"
import Billboard from "@/components/billboards"
import ProductList from "@/components/product-list"
import Container from "@/components/ui/container"

const HomePage = async () => {
  const products = await getProducts({isFeatured: true})
  const billboard = await getBillboard("327b5f50-6a3e-4a63-b403-910f8206982a");

  return (
    <Container>
      <div className="space-y-10 pb-10">
        <Billboard data={billboard} />
        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </Container>
  )
}

export default HomePage