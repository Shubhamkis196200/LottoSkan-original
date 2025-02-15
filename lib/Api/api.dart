import 'dart:convert';
import 'package:lotto_app/Common/constant.dart';
import 'package:lotto_app/Models/confirm_result_model.dart';
import 'package:lotto_app/Models/list_date.dart';
import 'package:lotto_app/Models/list_model.dart';
import 'package:http/http.dart' as http;
import 'package:lotto_app/Screens/lotto_listing_screen.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'package:lotto_app/Utils/myToasts.dart';
import 'Urls.dart';
import 'package:get/get.dart';

///**********************************GET LIST ********************************///

Future<http.Response?> getSetting() async {
  var client = http.Client();
  if (await isConnected()) {
    try {
      var response = await client.get(
        Uri.parse(BASEURL + SETTING),
      );
      print("BASE URL ${response.request!.url}");
      print("Satus code: ${response.statusCode}");
      print("Lotto Response " + response.body);
      return response;
    } finally {
      client.close();
    }
  }
}

Future<LottoList?> getLottoList() async {
  var client = http.Client();
  if (await isConnected()) {
    try {
      var response = await client.get(
        Uri.parse(BASEURL + LOTTOLISTURL),
      );
      print("BASE URL $BASEURL$LOTTOLISTURL");
      print("Satus code: ${response.statusCode}");
      print("Lotto Response " + response.body);
      var res = lottoListFromJson(response.body);
      return res;
    } finally {
      client.close();
    }
  }
}

///**********************************GET DATE LIST ********************************///

Future<LottoDateList?> getDateList() async {
  var client = http.Client();
  if (await isConnected()) {
    try {
      var response = await client.get(
        Uri.parse("$BASEURL$DATELIST?id="
            //"61dbf513cc484f2c593b395d"
        "${AppConstants.TICKETID}"
        ),
      );
      print("Lotto Response " + response.body);
      print(response.body);
      print("BASE URL $BASEURL$DATELIST?id=${AppConstants.TICKETID}");
      print(response.statusCode);
      var res = (response.body);
      return lottoDateListFromJson(res);

    } finally {
      client.close();
    }
  }
}

///====================== POST SPECIAL TICKET FOR LAST TWO TICKETS ================================///
Future<ConfirmResults?> postSpecialTicket() async {
  var client = http.Client();
  if (await isConnected()) {
    try {
      Map<String, String> headers = {
        "content-type": "application/json",
      };
      Map body = {

        "numberList": AppConstants.FINAL_LIST,
        "from_date": AppConstants.FDATE,
        "to_date": AppConstants.TDATE,
        "lottery": AppConstants.TICKETID,
        "superNumberList": AppConstants.isSuperValue.value == true
            ? ""
            : AppConstants.SUPERNUMBERLIST
      };
      var response = await client.post(Uri.parse(BASEURL + LOTTOTICKET),
          body: json.encode(body), headers: headers);

      print("Body==> numberList: ${AppConstants.FINAL_LIST}\n "
          "from_date: ${AppConstants.FDATE}\n"
          "to_date: ${AppConstants.TDATE}\n"
          "lottery: ${AppConstants.TICKETID}\n"
          "SuperNumberList: ${AppConstants.SUPERNUMBERLIST}");
      print("Sent body is ${json.encode(body)}");
      print(response.body);
      print(response.statusCode);
      print("BASE URL $BASEURL$LOTTOTICKET");
      final res = confirmResultsFromJson(response.body);
      return res;
    } catch (e) {
      longToastMessage('Unable to fetch details');
      AppConstants.DATELIST=[];
      AppConstants.FDATE="";
      AppConstants.TDATE="";
      Get.offAll(LottoListing());
    } finally {
      client.close();
    }
  }
}
