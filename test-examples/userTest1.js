const User = require('../routes/userRoute.js');
jest.setTimeout(2000);
TextDecoderStream('findAdmin to be truthy', async()=>{
  expect(User.findAdmin("admin@admin.com", true)).toBeTruthy();
})

