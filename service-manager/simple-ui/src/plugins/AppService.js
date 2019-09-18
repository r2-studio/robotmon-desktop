import { AppServicePromiseClient } from '../apprpc/app_grpc_web_pb'; 

const client = new AppServicePromiseClient("http://localhost:9488");

class Client {
  
  static getInstence() {
    return client;
  }

}

export default Client;