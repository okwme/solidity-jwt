const TestIdentity = artifacts.require("TestIdentity");
require('chai').should();
contract.only("Identity", function([funder, owner]) {

  const device = '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef';
  const aud = '506633709634-d24fdq3asqfnu874lahloir4duqme20t.apps.googleusercontent.com'
  const sub = '107385817006936935899'

  before('fund device', async function () {
    await web3.eth.sendTransaction({ from: funder, to: device, value: 1e18 });
  });

  before('deploy', async function () {
    this.instance = await TestIdentity.new(sub, aud, { from: owner });
  });

  it('works', async function () {

    const amount = '0x' + '1'.padStart(64, '0')
    const recepient = '0x35b701e4550f0fcc45d854040562e35a4600e4ee'
    const header = `{"alg":"RS256","kid":"a06824b79e3982394d5ce7ac75bf92cba30a2e25","typ":"JWT"}`
    const payload = `{"iss":"accounts.google.com","azp":"506633709634-d24fdq3asqfnu874lahloir4duqme20t.apps.googleusercontent.com","aud":"506633709634-d24fdq3asqfnu874lahloir4duqme20t.apps.googleusercontent.com","sub":"107385817006936935899","email":"billy.rennekamp@gmail.com","email_verified":true,"at_hash":"SLj7kaoKjz98C_JMe4VFsw","nonce":"NbcB5FUPD8xF2FQEBWLjWkYA5O4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQ","name":"billy rennekamp","picture":"https://lh3.googleusercontent.com/a-/AAuE7mAHHV0hYVkFiSrRCklqYrhZHAeMsz5AuirS0CEBSQ=s96-c","given_name":"billy","family_name":"rennekamp","locale":"en","iat":1573309355,"exp":1573312955,"jti":"f33823e00df60a4ff5b80d5e1c696cd73f315ae0"}`
    const signatureBase64 = 'aqJMI7KLHGeq3_ETEfz4hkjADss4066Huh9bv6ZBpeK2ppQeNv0uvYBmqFBilE4mcpuwcLoHoRdx6rNPjMZno6tD7CynajFZm4O4C5wS3jzN-WDG2arwr3a1mZV0JopY0ZCxJvjIk1huA9sJJIuQOXZ7mhFY93EuzXs6UQqaqKahmDr4yguLVUi809F_JvockFHGN6rRA3l-3KTOAqrSB2nIGcWXikTO8MZUxJwvKgi-ZL1s_KKgNCd9peGLdLElR9C_UXe7zcGbfZnFLt1Vqjf6qAgZfDltHqPS1Q0KccmLUyub-L_Wj2TbeoVmS7VA9fKTXZu1gjOAs5qiZAMCaw';
    const signature = '0x' + Buffer.from(signatureBase64, 'base64').toString('hex');

    const wasDeviceRegistered = await this.instance.accounts(device);
    wasDeviceRegistered.should.be.false;

    const tx = await this.instance.recover(header, payload, signature, recepient, amount, { from: device, gas: 6e6 });
    console.log({tx})
    // console.log("    gas:", tx.receipt.gasUsed);
    // const deviceRegistered = await this.instance.accounts(device);
    // deviceRegistered.should.be.true;
  });

});

