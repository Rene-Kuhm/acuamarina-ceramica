// Simular respuesta del endpoint de upload SIN productId
const mockCloudinaryResult = {
  secure_url: 'https://res.cloudinary.com/demo/image/upload/v1234567890/aguamarina/products/abc123.jpg',
  public_id: 'aguamarina/products/abc123',
  width: 1200,
  height: 1200,
};

const responseWithoutProductId = {
  success: true,
  data: {
    url: mockCloudinaryResult.secure_url,
    cloudinaryId: mockCloudinaryResult.public_id,
    width: mockCloudinaryResult.width,
    height: mockCloudinaryResult.height,
  },
};

console.log('📤 Respuesta cuando se sube imagen SIN productId:');
console.log(JSON.stringify(responseWithoutProductId, null, 2));
console.log('');
console.log('✅ Verificación:');
console.log(`   - Tiene cloudinaryId: ${responseWithoutProductId.data.cloudinaryId ? 'SÍ' : 'NO'}`);
console.log(`   - Valor: ${responseWithoutProductId.data.cloudinaryId}`);
console.log('');
console.log('🔄 Al vincular al producto, se enviaría:');
const imagesToLink = [{
  url: responseWithoutProductId.data.url,
  cloudinaryId: responseWithoutProductId.data.cloudinaryId,
  altText: '',
  isPrimary: true,
}];
console.log(JSON.stringify(imagesToLink, null, 2));
