import 'package:get/get.dart';
import 'package:lotto_app/Api/api.dart';
import 'package:lotto_app/Utils/appConstants.dart';

class ConfirmationResultController extends GetxController {
  RxBool isLoading = false.obs;
  RxBool isAmount = false.obs;
  List SPACIALTICKETRESULT_LIST = [];
  @override
  void onInit() {
    getConfirmValue();
    super.onInit();
  }

  getConfirmValue() {
    isLoading.value = true;
    SPACIALTICKETRESULT_LIST = [];
    AppConstants.SUPERNUMBERS = [];
    postSpecialTicket().then((value) {

      /*SPACIALTICKETRESULT_LIST = value!.result;
      AppConstants.SUPERNUMBERS.add(value.result.superNumbers);
      for (int i = 0; i < SPACIALTICKETRESULT_LIST.length; i++) {
        if (SPACIALTICKETRESULT_LIST[i].amount > 0) {
          isAmount.value = true;
        }
         if ( value.result.superNumbers?.amount != null){
           if (value.result.superNumbers!.amount > 0){
              isAmount.value = true;
           }
         }
        isLoading.value = false;
      }*/

      SPACIALTICKETRESULT_LIST = value!.result;
      /*AppConstants.SUPERNUMBERS.add(value.result);
      for (int i = 0; i < SPACIALTICKETRESULT_LIST.length; i++) {
        if (SPACIALTICKETRESULT_LIST[i].amount > 0) {
          isAmount.value = true;
        }
         if ( value.result.superNumbers?.amount != null){
           if (value.result.superNumbers!.amount > 0){
              isAmount.value = true;
           }
         }
        isLoading.value = false;
      }*/
      isLoading.value = false;

    });
  }
}
