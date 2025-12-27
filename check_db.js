const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkProduct() {
    const product = await prisma.product.findFirst({
        where: { slug: 'kablosuz-mouse' },
        select: { id: true, name: true, origin: true, sku: true, barcode: true }
    });
    console.log('Product Data:', product);
}

checkProduct()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
