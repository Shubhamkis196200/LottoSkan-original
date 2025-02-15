import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:lotto_app/Common/Colors.dart';
import 'package:lotto_app/Common/Strings.dart';
import 'package:lotto_app/Common/app_theme.dart';
import 'package:lotto_app/Common/widget.dart';
import 'package:lotto_app/Controller/confirm_result_controller.dart';
import 'package:lotto_app/Models/confirm_result_model.dart';
import 'package:lotto_app/Screens/lotto_listing_screen.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'confirmation_screen.dart';

class ConFirmResultScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final ConfirmationResultController controller =
        Get.put<ConfirmationResultController>(ConfirmationResultController());
    final sizedConfig = SizeConfig();
    return WillPopScope(
      onWillPop: () async {
        AppConstants.DATELIST=[];
        AppConstants.FDATE="";
        AppConstants.TDATE="";
        AppConstants.DISPLAYDATE="";
        Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(
            builder: (BuildContext context) {
              return LottoListing();
            },
          ),
        );
        return new Future(() => false);
      },
      child: /*Scaffold(
        backgroundColor: blue,
        appBar: PreferredSize(
          preferredSize: Size.fromHeight(80),
          child: AppBar(
            automaticallyImplyLeading: false,
            elevation: 0,
            backgroundColor: yellow,
            centerTitle: true,
            leading: GestureDetector(
              onTap: () {
                AppConstants.FDATE="";
                AppConstants.TDATE="";
                AppConstants.DISPLAYDATE="";
                AppConstants.DATELIST=[];
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) {
                      return LottoListing();
                    },
                  ),
                );
              },
              child: Container(
                  padding: EdgeInsets.all(10),
                  margin: EdgeInsets.only(top: 18),
                  child: Image.asset(
                    back,
                  )),
            ),
            title: Container(
              margin: EdgeInsets.only(top: 18),
              child: Text('wynik'.tr, style: headline),
            ),
          ),
        ),
        body: Obx(
          () => controller.isLoading.value
              ? Center(
                  child: CircularProgressIndicator(
                  color: yellow,
                ))
              : Container(
                  // width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage(controller.isAmount.value ? coin : leaf),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: SingleChildScrollView(
                    child: Column(
                      children: [
                        SizedBox(
                          height: 18,
                        ),
                        ListView.builder(
                            physics: NeverScrollableScrollPhysics(),
                            shrinkWrap: true,
                            itemCount:
                                controller.SPACIALTICKETRESULT_LIST.length,
                            itemBuilder: (context, i) {
                              return Container(
                                padding: EdgeInsets.only(top: 28, bottom: 14),
                                alignment: Alignment.center,
                                // constraints:
                                //     BoxConstraints(maxHeight: Get.height / 3.8),
                                // height: Get.height / 4.2,
                                // height:  sizedConfig.heightSize(context, 28.0),
                                margin: EdgeInsets.symmetric(vertical: 10),
                                color: controller.SPACIALTICKETRESULT_LIST[i].matched == 0
                                    ? red : green,
                                width: double.infinity,
                                child: Center(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    children: [
                                      Center(
                                        child: Wrap(
                                          direction: Axis.horizontal,
                                          runSpacing: 20,
                                          spacing: sizedConfig.widthSize(context, -2.9),
                                          alignment: WrapAlignment.start,
                                          children: List.generate(
                                              controller.SPACIALTICKETRESULT_LIST[i].numberList.length, (index) {
                                            if (controller.SPACIALTICKETRESULT_LIST[i].numberList[index].matched == true) {
                                              return customCircle(controller.SPACIALTICKETRESULT_LIST[i].numberList[index].number.toString());
                                            } else if (controller.SPACIALTICKETRESULT_LIST[i]
                                                    .numberList[index].number.toString() == " ") {
                                              return customContainer('0');
                                            } else {
                                              return customContainer(controller.SPACIALTICKETRESULT_LIST[i]
                                                  .numberList[index].number.toString());
                                            }
                                          }),
                                        ),
                                      ),
                                      SizedBox(
                                        height: sizedConfig.heightSize(
                                            context, 2.5),
                                      ),
                                      controller.SPACIALTICKETRESULT_LIST[i].matched == 0
                                          ? Padding(
                                              padding: const EdgeInsets.only(bottom: 5.0),
                                              child: Text('luck'.tr, textAlign: TextAlign.center, style: subtitle),
                                            )
                                          : controller.SPACIALTICKETRESULT_LIST[i].matched == controller.SPACIALTICKETRESULT_LIST[i].numberList.length
                                          ?Text(
//                                                  "${controller.SPACIALTICKETRESULT_LIST[i].matched.toString()} ${"congrats2".tr} ${controller.SPACIALTICKETRESULT_LIST[i].amount} zł !!",
                                          "${"congrats3".tr}", textAlign: TextAlign.center,
                                          style: subtitle):  controller.SPACIALTICKETRESULT_LIST[i].matched >1
                                                  // controller
                                                  //     .SPACIALTICKETRESULT_LIST[
                                                  //         i]
                                                  //     .numberList
                                                  //     .length
                                              ? Text(
//                                                  "${controller.SPACIALTICKETRESULT_LIST[i].matched.toString()} ${"congrats2".tr} ${controller.SPACIALTICKETRESULT_LIST[i].amount} zł !!",
                                                  "${controller.SPACIALTICKETRESULT_LIST[i].matched.toString()} ${"congrats2".tr}",
                                                  textAlign: TextAlign.center,
                                                  style: subtitle)
                                              : Text(
                                              //    "${controller.SPACIALTICKETRESULT_LIST[i].matched.toString()} ${"congrats".tr}  ${controller.SPACIALTICKETRESULT_LIST[i].amount} zł !!",
                                                  "${controller.SPACIALTICKETRESULT_LIST[i].matched.toString()} ${"congrats".tr}",
                                                  textAlign: TextAlign.center,
                                                  style: subtitle)
                                    ],
                                  ),
                                ),
                              );
                            }),
                        Visibility(
                          visible: AppConstants.isSuperValue.value == true
                              ? false
                              : true,
                          child: Text("Super Szanza",
                              style: headline.copyWith(
                                  fontSize: 17, color: black)),
                        ),
                        Visibility(
                          visible: AppConstants.isSuperValue.value == true
                              ? false
                              : true,
                          child: ListView.builder(
                              physics: NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              itemCount: AppConstants.SUPERNUMBERS.length,
                              itemBuilder: (context, ind) {
                                return Container(
                                  padding: EdgeInsets.only(top: 28, bottom: 14),
                                  alignment: Alignment.center,
                                  // constraints:
                                  //     BoxConstraints(maxHeight: Get.height / 4),
                                  // height: Get.height / 4.2,
                                  margin: EdgeInsets.symmetric(vertical: 10),
                                  color:
                                      AppConstants.SUPERNUMBERS[0].matched == 0
                                          ? red
                                          : green,
                                  width: double.infinity,
                                  child: Center(
                                    child: Column(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                      children: [
                                        Center(
                                          child: Wrap(
                                            runSpacing: 20,
                                            spacing: sizedConfig.widthSize(
                                                context, -2.9),
                                            alignment: WrapAlignment.start,
                                            children: List.generate(
                                                AppConstants
                                                    .SUPERNUMBERS[ind]
                                                    .numberList
                                                    .length, (index) {
                                              if (AppConstants
                                                      .SUPERNUMBERS[0]
                                                      .numberList[index]
                                                      .matched ==
                                                  true) {
                                                return customCircle(AppConstants
                                                    .SUPERNUMBERS[0]
                                                    .numberList[index]
                                                    .number
                                                    .toString());
                                              } else if (AppConstants
                                                      .SUPERNUMBERS[0]
                                                      .numberList[index]
                                                      .number
                                                      .toString() ==
                                                  " ") {
                                                return customContainer('0');
                                              } else {
                                                return customContainer(
                                                    AppConstants
                                                        .SUPERNUMBERS[0]
                                                        .numberList[index]
                                                        .number
                                                        .toString());
                                              }
                                            }),
                                          ),
                                        ),
                                        SizedBox(
                                          height: sizedConfig.heightSize(
                                              context, 2.5),
                                        ),
                                        AppConstants.SUPERNUMBERS[ind]
                                                    .matched ==
                                                0
                                            ? Padding(
                                                padding: const EdgeInsets.only(
                                                    bottom: 5.0),
                                                child: Text('luck'.tr,
                                                    textAlign: TextAlign.center,
                                                    style: subtitle),
                                              )
                                            : AppConstants.SUPERNUMBERS[ind]
                                                        .matched ==
                                                    AppConstants
                                                        .SUPERNUMBERS[ind]
                                                        .numberList
                                                        .length
                                                ? Text(
                                                    "${AppConstants.SUPERNUMBERS[ind].matched.toString()} "
                                                    "${"congrats2".tr} ${AppConstants.SUPERNUMBERS[ind].amount} zł !!",
                                                    textAlign: TextAlign.center,
                                                    style: subtitle)
                                                : Text(
                                                    "${AppConstants.SUPERNUMBERS[ind].matched.toString()} "
                                                    "${"congrats".tr} ${AppConstants.SUPERNUMBERS[ind].amount} zł !!",
                                                    textAlign: TextAlign.center,
                                                    style: subtitle)
                                      ],
                                    ),
                                  ),
                                );
                              }),
                        ),
                        SizedBox(height: 18),
                        Container(
                          margin: EdgeInsets.symmetric(horizontal: 115),
                          child: customButton('Skanujponownie'.tr, yellow, () {
                            Get.offAll(LottoListing());
                            AppConstants.FDATE="";
                            AppConstants.TDATE="";
                            AppConstants.DISPLAYDATE="";
                          }),
                        ),
                        SizedBox(height: 18),
                      ],
                    ),
                  ),
                ),
        ),
      ),*/
      Scaffold(
        backgroundColor: blue,
        appBar: PreferredSize(
          preferredSize: Size.fromHeight(80),
          child: AppBar(
            automaticallyImplyLeading: false,
            elevation: 0,
            backgroundColor: yellow,
            centerTitle: true,
            leading: GestureDetector(
              onTap: () {
                AppConstants.FDATE="";
                AppConstants.TDATE="";
                AppConstants.DISPLAYDATE="";
                AppConstants.DATELIST=[];
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute<void>(
                    builder: (BuildContext context) {
                      return LottoListing();
                    },
                  ),
                );
              },
              child: Container(
                  padding: EdgeInsets.all(10),
                  margin: EdgeInsets.only(top: 18),
                  child: Image.asset(back,
                  )),
            ),
            title: Container(
              margin: EdgeInsets.only(top: 18),
              child: Text('wynik'.tr, style: headline),
            ),
          ),
        ),
        body: Obx(
              () => controller.isLoading.value
              ? Center(
              child: CircularProgressIndicator(
                color: yellow,
              ))
              : Container(
            height: MediaQuery.of(context).size.height,
            decoration: BoxDecoration(
              image: DecorationImage(
                image: AssetImage(controller.isAmount.value ? coin : leaf),
                fit: BoxFit.cover,
              ),
            ),
            child: SingleChildScrollView(
              child: Column(
                children: [
                  SizedBox(
                    height: 18,
                  ),

                  ListView.separated(
                      physics: NeverScrollableScrollPhysics(),
                      shrinkWrap: true,
                      itemCount: controller.SPACIALTICKETRESULT_LIST.length,
                      itemBuilder: (context, i){
                        return MyExpandableWidget(controller.SPACIALTICKETRESULT_LIST[i]);
                      }, separatorBuilder: (BuildContext context, int index) {
                    return Divider(
                      thickness: 3,
                      height: 15,
                      color: Colors.white,
                    );
                  }),
                  SizedBox(height: 18),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 115),
                    child: customButton('Skanujponownie'.tr, yellow, () {
                      Get.offAll(LottoListing());
                      AppConstants.FDATE="";
                      AppConstants.TDATE="";
                      AppConstants.DISPLAYDATE="";
                    }),
                  ),
                  SizedBox(height: 18),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
class MyExpandableWidget extends StatelessWidget {
  final ResultElement results;

  MyExpandableWidget(this.results);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context).copyWith(dividerColor: Colors.transparent);
    if (results.result.isNull)
      return ListTile(title: Text(results.date.toString()));
    return Theme(data: theme,
        child: ExpansionTile(
            trailing: SizedBox.shrink(),
            initiallyExpanded: true,
            key: PageStorageKey<ResultElement>(results),
            title: Text("${results.date.day.toString()}-${results.date.month.toString()}-${results.date.year.toString()}",
                style: TextStyle(fontSize: 20, color: Colors.white, fontWeight: FontWeight.bold)),
            children: [numbersCard(results.result)]
        )
    );
  }
}

numbersCard(ResultResult data) {
  final sizedConfig = SizeConfig();
  return Column(
    children: [
      ListView.builder(
          physics: NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: data.numbers.length,
          itemBuilder: (context, i) {
            return Container(
              padding: EdgeInsets.only(top: 28, bottom: 14),
              alignment: Alignment.center,
              margin: EdgeInsets.symmetric(vertical: 10),
              color: data.numbers[i].matched == 0 ? red : green,
              width: double.infinity,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Center(
                      child: Wrap(
                        direction: Axis.horizontal,
                        runSpacing: 20,
                        spacing: sizedConfig.widthSize(context, -2.9),
                        alignment: WrapAlignment.start,
                        children: List.generate(
                            data.numbers[i].numberList.length, (index) {
                          if (data.numbers[i].numberList[index].matched == true) {
                            return customCircle(data.numbers[i].numberList[index].number.toString());
                          } else if (data.numbers[i].numberList[index].number.toString() == " ") {
                            return customContainer('0');
                          } else {
                            return customContainer(data.numbers[i].numberList[index].number.toString());
                          }
                        }),
                      ),
                    ),
                    SizedBox(
                      height: sizedConfig.heightSize(
                          context, 2.5),
                    ),
                    data.numbers[i].matched == 0
                        ? Padding(
                            padding: const EdgeInsets.only(bottom: 5.0),
                            child: Text('luck'.tr, textAlign: TextAlign.center, style: subtitle),
                        )
                        : data.numbers[i].matched == data.numbers[i].numberList.length
                        ? Text("${"congrats3".tr}", textAlign: TextAlign.center,
                            style: subtitle)
                        : data.numbers[i].matched > 1
                        ? Text("${data.numbers[i].matched.toString()} ${"congrats2".tr}",
                            textAlign: TextAlign.center, style: subtitle)
                        : Text("${data.numbers[i].matched.toString()} ${"congrats".tr}",
                            textAlign: TextAlign.center, style: subtitle)
                  ],
                ),
              ),
            );
          }),
      AppConstants.isSuperValue.value == true
          ? SizedBox()
          : Text("Super Szanza", style: headline.copyWith(fontSize: 17, color: black)),

      AppConstants.isSuperValue.value == true
          ? SizedBox()
          : Container(
            padding: EdgeInsets.only(top: 28, bottom: 14),
            alignment: Alignment.center,
            margin: EdgeInsets.symmetric(vertical: 10),
            color: data.superNumbers?.matched == 0 ? red : green,
            width: double.infinity,
            child: Center(
              child: Column(
                mainAxisAlignment:
                MainAxisAlignment.spaceBetween,
                crossAxisAlignment:
                CrossAxisAlignment.center,
                children: [
                  Center(
                    child: Wrap(
                      runSpacing: 20,
                      //spacing: sizedConfig.widthSize(context, -2.9),
                      alignment: WrapAlignment.start,
                      children: List.generate(
                          data.superNumbers!.numberList.length, (index) {
                        if (data.superNumbers!.numberList[index].matched == true) {
                          return customCircle(data.superNumbers!.numberList[index].number.toString());
                        } else if (data.superNumbers!.numberList[index].number.toString() == " ") {
                          return customContainer('0');
                        } else {
                          return customContainer(data.superNumbers!.numberList[index].number.toString());
                        }
                      }),
                    ),
                  ),
                  //SizedBox(height: sizedConfig.heightSize(context, 2.5)),
                  SizedBox(height: 15),
                  data.superNumbers!.matched == 0
                      ? Padding(padding: const EdgeInsets.only(bottom: 5.0),
                          child: Text('luck'.tr, textAlign: TextAlign.center, style: subtitle),
                        )
                      : data.superNumbers!.matched == data.superNumbers!.numberList.length
                      ? Text("${data.superNumbers!.matched.toString()} "
                          "${"congrats2".tr}", textAlign: TextAlign.center, style: subtitle)
                      : Text("${data.superNumbers!.matched.toString()} "
                          "${"congrats".tr}", textAlign: TextAlign.center, style: subtitle)
                ],
              ),
            ),
          )
    ],
  );
}