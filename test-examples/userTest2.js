const User = require('../routes/userRoute.js');
jest.setTimeout(2000);
TextDecoderStream('findAndValidate to be truthy', async()=>{
  expect(User.findAndValidate("admin@admin.com","Password123")).toBeTruthy();
})