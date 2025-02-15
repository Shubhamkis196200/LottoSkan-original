import 'dart:io';

import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:lotto_app/Common/Colors.dart';
import 'package:lotto_app/Common/Strings.dart';
import 'package:lotto_app/Common/app_theme.dart';
import 'package:lotto_app/Common/widget.dart';
import 'package:lotto_app/Controller/confirmation_screen_controller.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'package:lotto_app/Utils/myToasts.dart';
import 'package:syncfusion_flutter_datepicker/datepicker.dart';
import 'lotto_listing_screen.dart';
import 'package:intl/intl.dart';

class ConfirmationScreen extends StatefulWidget {
  //String title;
  //ConfirmationScreen({required this.title});

  @override
  State<ConfirmationScreen> createState() => _ConfirmationScreenState();
}

class _ConfirmationScreenState extends State<ConfirmationScreen> {
  final formKey = GlobalKey<FormState>();

  DateTime currentDate = DateTime.now();
  var availableDates = "";

  // Future<void> _selectDate(BuildContext context) async {
  //   final DateTime? pickedDate = await showDatePicker(
  //       context: context,
  //       initialDate: AppConstants.DATELIST.length == 0
  //           ? DateTime.now()
  //           : AppConstants.DATELIST.first,
  //       firstDate:
  //           AppConstants.DATELIST.length == 0 ? DateTime.now() : DateTime(1979),
  //       lastDate: AppConstants.DATELIST.length == 0
  //           ? DateTime.now()
  //           : AppConstants.DATELIST.last,
  //       selectableDayPredicate: AppConstants.DATELIST.length == 0
  //           ? null
  //           : (DateTime val) => AppConstants.DATELIST.contains(val),
  //       builder: (context, child) {
  //         return Theme(
  //             data: ThemeData().copyWith(
  //               primaryColor: lightblue,
  //               colorScheme: ColorScheme.light(primary: lightblue)
  //                   .copyWith(secondary: lightblue),
  //             ),
  //             child: child!);
  //       });
  //   if (pickedDate != null && pickedDate != currentDate) {
  //     setState(() {
  //       currentDate = pickedDate;
  //       //final DateFormat formatter = DateFormat('yyyy/MM/dd');
  //       final DateFormat formatter = DateFormat('dd-MM-yyyy');
  //       final String formatted = formatter.format(currentDate);
  //       //AppConstants.DATE = formatted;
  //       AppConstants.DISPLAYDATE = formatted;
  //       AppConstants.FDATE = "${currentDate.toLocal()}".split(' ')[0];
  //       print("Date...${AppConstants.FDATE} formatted==$formatted");
  //     });
  //   }
  // }
  //
  String _selectedDate = '';
  String _dateCount = '';
  String _range = '';
  String _rangeCount = '';

  void _onSelectionChanged(DateRangePickerSelectionChangedArgs args) {
    setState(() {
      if (args.value is PickerDateRange) {
        _range = '${DateFormat('dd-MM-yyyy').format(args.value.startDate)} -'
            ' ${DateFormat('dd-MM-yyyy').format(args.value.endDate ?? args.value.startDate)}';
      } else if (args.value is DateTime) {
        _selectedDate = args.value.toString();
      } else if (args.value is List<DateTime>) {
        _dateCount = args.value.length.toString();
      } else {
        _rangeCount = args.value.length.toString();
      }
      AppConstants.FDATE =
          '${DateFormat('yyyy-MM-dd').format(args.value.startDate)}';
      AppConstants.TDATE =
          '${DateFormat('yyyy-MM-dd').format(args.value.endDate)}';

      AppConstants.DISPLAYDATE =
          '${DateFormat('dd-MM-yyyy').format(args.value.startDate)} - ${DateFormat('dd-MM-yyyy').format(args.value.endDate)}';
    });
  }

  final controller = Get.put(ConfirmationScreenController());
  InterstitialAd? interstitialAd;
  @override
  void initState() {
    super.initState();
    controller.getDates();
    print("ADS VALUE IS ${AppConstants.ISADS}");
    if(AppConstants.ISADS == true) {
      loadAds();
    }
  }

  loadAds() async {
    await InterstitialAd.load(adUnitId: Platform.isAndroid==true
        ? "ca-app-pub-2392228481266917/7222112411"
        : "ca-app-pub-2392228481266917/1727077302",
        request: AdRequest(),
        adLoadCallback: InterstitialAdLoadCallback(
            onAdLoaded: (ad){
              ad.fullScreenContentCallback = FullScreenContentCallback(
                  onAdDismissedFullScreenContent: (ad){
                    debugPrint("ad is finished");
                    controller.setSuperValues();
                    controller.getValues();
                  }
              );
              setState(() {
                interstitialAd = ad;
              });
            },
            onAdFailedToLoad: (error){
              // debugPrint("Failed to load ad ${error.message}");
              // Get.snackbar("Error", error.message,
              //     snackPosition: SnackPosition.TOP,
              //     duration: Duration(seconds: 5),
              //     backgroundColor: Colors.red[300]);
            })
    );
  }

  @override
  void dispose() {
    interstitialAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final sizedConfig = SizeConfig();
    // print("List Length==>${AppConstants.TICKET_LIST.length}");
    // print("List2 Length==>${AppConstants.TICKET_LIST2.length}");
    return WillPopScope(
      onWillPop: () async {
        AppConstants.DATELIST = [];
        AppConstants.FDATE = "";
        AppConstants.TDATE = "";
        AppConstants.DISPLAYDATE = "";
        Navigator.of(context).pushReplacement(
          MaterialPageRoute<void>(
            builder: (BuildContext context) {
              return LottoListing();
            },
          ),
        );
        return new Future(() => false);
      },
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () {
          FocusScope.of(context).requestFocus(FocusNode());
        },
        child: Scaffold(
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
                  AppConstants.FDATE = "";
                  AppConstants.TDATE = "";
                  AppConstants.DISPLAYDATE = "";
                  AppConstants.DATELIST = [];
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
                    child: Image.asset(back)),
              ),
              title: Container(
                margin: EdgeInsets.only(top: 18),
                child: Text('confirmation'.tr /*widget.title*/, style: headline),
              ),
            ),
          ),
          body: SingleChildScrollView(
            child: Container(
              padding: EdgeInsets.symmetric(horizontal: 25),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(height: 18),
                  Text('confirmresult'.tr,
                    style: subtitle.copyWith(fontSize: 15),
                  ),
                  SizedBox(height: 18),
                  Text('mistake'.tr, style: subtitle.copyWith(fontSize: 15)),
                  SizedBox(height: 5),
                  Row(
                    mainAxisAlignment: AppConstants.TICKET_LIST2.length == 0
                        ? MainAxisAlignment.center
                        : MainAxisAlignment.spaceBetween,
                    // mainAxisSize: MainAxisSize.min,
                    children: [
                      SizedBox(
                        width: sizedConfig.widthSize(context, 12.8),
                      ),
                      Container(
                        margin: EdgeInsets.only(top: 18),
                        child: Text('${AppConstants.NOTEVALUE[0]}',
                            style:
                                headline.copyWith(fontSize: 17, color: black)),
                      ),
                      SizedBox(
                        width: sizedConfig.widthSize(context, 14.8),
                      ),
                      Visibility(
                        visible: AppConstants.TICKET_LIST2.length == 0
                            ? false
                            : true,
                        child: Container(
                          margin: EdgeInsets.only(top: 18),
                          child: Text(
                              AppConstants.NOTEVALUE.length == 1
                                  ? ""
                                  : AppConstants.NOTEVALUE[1],
                              style: headline.copyWith(
                                  fontSize: 17, color: black)),
                        ),
                      ),
                      SizedBox(width: sizedConfig.widthSize(context, 2.8)),
                    ],
                  ),
                  SizedBox(width: sizedConfig.widthSize(context, 14.8)),
                  InkWell(
                    onTap: () {
                      //print("AppConstantList====${AppConstants.DATELIST.length}");
                      //_selectDate(context);
                      showDialog<Dialog>(
                          context: context,
                          builder: (BuildContext context) {
                            return Padding(
                              padding: EdgeInsets.all(20),
                              child: Column(
                                children: [
                                  Card(
                                      elevation: 25,
                                      color: Colors.white,
                                      child: SfDateRangePicker(
                                        view: DateRangePickerView.month,
                                        selectableDayPredicate:
                                            AppConstants.DATELIST.length == 0
                                                ? null
                                                : (DateTime val) => AppConstants.DATELIST.contains(val),
                                        onSelectionChanged: _onSelectionChanged,
                                        selectionMode: DateRangePickerSelectionMode.range,
                                        minDate: AppConstants.DATELIST.first,
                                        maxDate: AppConstants.DATELIST.last,
                                        monthFormat: 'MMM',
                                        monthViewSettings: DateRangePickerMonthViewSettings(dayFormat: 'E'),
                                        //initialDisplayDate: AppConstants.DATELIST.first,
                                        initialSelectedRange: PickerDateRange(
                                            AppConstants.DATELIST.last.subtract(const Duration(days: 2)),
                                            AppConstants.DATELIST.last),
                                        showActionButtons: true,
                                        onSubmit: (v){
                                          print("OK Pressed $v");
                                          Get.back();
                                        },
                                        onCancel: (){
                                          Get.back();
                                        },
                                      )
                                  ),
                                ],
                              ),
                            );
                          });
                    },
                    child: Container(
                        height: 41,
                        margin: EdgeInsets.only(top: 5, bottom: 0, right: 6),
                        decoration: BoxDecoration(
                            border:
                                Border.all(color: Colors.black54, width: 1.0),
                            borderRadius: BorderRadius.circular(25),
                            color: white),
                        child: Center(
                            child: Padding(
                          padding: EdgeInsets.only(left: 20, right: 20),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                AppConstants.DISPLAYDATE == ""
                                    ? "Wybierz datę losowania".tr
                                    : AppConstants.DISPLAYDATE,
                                style: TextStyle(fontSize: 16),
                              ),
                              Icon(Icons.date_range)
                            ],
                          ),
                        ))),
                  ),
                  Row(
                    children: [
                      Expanded(
                        flex: 8,
                        child: Form(
                          key: formKey,
                          child: ListView.builder(
                              padding: EdgeInsets.zero,
                              addRepaintBoundaries: false,
                              physics: NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              itemCount: AppConstants.TICKET_LIST.length,
                              itemBuilder: (context, index) {
                                return Container(
                                  margin: EdgeInsets.only(
                                    top: 5,
                                    bottom: 0,
                                  ),
                                  child: textFormField(
                                    0,
                                    controller.textEditingControllers[index],
                                    Visibility(
                                      visible:
                                          AppConstants.TICKET_LIST2.length == 0
                                              ? true
                                              : false,
                                      child: GestureDetector(
                                        onTap: index > controller.length - 1
                                            ? () {
                                                setState(() {
                                                  if (controller.length !=
                                                      AppConstants
                                                          .TICKET_LIST.length) {
                                                    AppConstants.TICKET_LIST
                                                        .removeAt(index);
                                                    controller
                                                        .textEditingControllers
                                                        .removeAt(index);
                                                    if (AppConstants
                                                            .TICKET_LIST2
                                                            .length >
                                                        0) {
                                                      AppConstants.TICKET_LIST2
                                                          .removeAt(index);
                                                      controller
                                                          .singleDigitTextEditingControllers
                                                          .removeAt(index);
                                                    }
                                                  }
                                                });
                                              }
                                            : () {},
                                        child: Icon(
                                          Icons.close,
                                          size: 18,
                                          color: index < controller.length
                                              ? white
                                              : black,
                                        ),
                                      ),
                                    ),
                                  ),
                                );
                              }),
                        ),
                      ),
                      SizedBox(
                        width: 8,
                      ),
                      Visibility(
                        visible: AppConstants.TICKET_LIST2.length == 0
                            ? false
                            : true,
                        child: Expanded(
                          flex: 3,
                          child: Container(
                            child: ListView.builder(
                              padding: EdgeInsets.zero,
                              addRepaintBoundaries: false,
                              physics: NeverScrollableScrollPhysics(),
                              shrinkWrap: true,
                              itemCount: AppConstants.TICKET_LIST2.length,
                              itemBuilder: (context, index) {
                                return Row(
                                  // mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Expanded(
                                      child: Container(
                                        margin:
                                            EdgeInsets.only(top: 5, bottom: 0),
                                        child: textFormField2(
                                          0,
                                          controller
                                                  .singleDigitTextEditingControllers[
                                              index],
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              },
                            ),
                          ),
                        ),
                      ),
                      Visibility(
                        visible: AppConstants.TICKET_LIST2.length != 0
                            ? true
                            : false,
                        child: Container(
                          alignment: Alignment.center,
                          margin: EdgeInsets.only(left: 5),
                          width: 15,
                          child: ListView.builder(
                            padding: EdgeInsets.zero,
                            addRepaintBoundaries: false,
                            physics: NeverScrollableScrollPhysics(),
                            shrinkWrap: true,
                            itemCount: AppConstants.TICKET_LIST.length,
                            itemBuilder: (context, index) {
                              return GestureDetector(
                                onTap: index > controller.length - 1
                                    ? () {
                                        setState(() {
                                          if (controller.length !=
                                              AppConstants.TICKET_LIST.length) {
                                            AppConstants.TICKET_LIST
                                                .removeAt(index);
                                            controller.textEditingControllers
                                                .removeAt(index);
                                            if (AppConstants
                                                    .TICKET_LIST2.length >
                                                0) {
                                              AppConstants.TICKET_LIST2
                                                  .removeAt(index);
                                              controller
                                                  .singleDigitTextEditingControllers
                                                  .removeAt(index);
                                            }
                                          }
                                        });
                                      }
                                    : () {},
                                child: Container(
                                  width: 0,
                                  height: 48,
                                  child: Center(
                                    child: Icon(
                                      Icons.close,
                                      size: 18,
                                      color: index < controller.length
                                          ? blue
                                          : black,
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    margin: EdgeInsets.only(
                        left: 48, right: 48, bottom: 5, top: 10),
                    child: customButton2(
                      'addMore'.tr,
                      yellow,
                      () {
                        setState(() {
                          if (AppConstants.TICKET_LIST.length < 10) {
                            controller.setNewValues();
                            controller.setValuesForMultiDigit();
                            if (AppConstants.TICKET_LIST2.length > 0) {
                              controller.setSingleDigitValues();
                            }
                          } else {
                            longToastMessage('maximumFields'.tr);
                          }
                        });
                      },
                    ),
                  ),
                  Obx(
                    () => Visibility(
                      visible:
                          controller.isVisible.value == false ? false : true,
                      child: Wrap(
                        children: List.generate(
                            controller.otpListTextEditingController.length,
                            (ind) {
                          return Container(
                            margin:
                                EdgeInsets.only(right: 2, top: 5, bottom: 5),
                            width: sizedConfig.widthSize(context, 11.5),
                            child: otpTextFormField(
                              controller.otpListTextEditingController[ind],
                            ),
                          );
                        }),
                      ),
                    ),
                  ),
                  Obx(
                    () => Visibility(
                      visible:
                          AppConstants.isSuperBtn.value == true ? true : false,
                      child: Container(
                        margin:
                            EdgeInsets.symmetric(horizontal: 48, vertical: 6),
                        child: customButton2(
                          controller.isVisible.value == false
                              ? 'SuperSzanza'.tr
                              : 'cancel'.tr,
                          yellow,
                          () {
                            if (controller.otpList.length < 7) {
                              // controller.otpListTextEditingController.clear();
                              // controller.otpList = ["", "", "", "", "", "",""];
                              controller.otpSetValues();
                            }
                            controller.isVisible.value = !controller.isVisible.value;
                            if (controller.isVisible.value == false) {
                              controller.otpListTextEditingController.clear();
                              AppConstants.SUPERNUMBERLIST = [];
                              controller.otpList = ["", "", "", "", "", ""];
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                  Container(
                    margin: EdgeInsets.symmetric(horizontal: 48, vertical: 5),
                    child: customButton(
                      'yesShowMeResult'.tr,
                      yellow,
                      () {
                        // debugPrint("ads value is ${AppConstants.ISADS}");
                        if (AppConstants.FDATE == "" &&
                            AppConstants.TDATE == "") {
                          longToastMessage('Proszę wybierz datę losowania'.tr);
                        } else if (AppConstants.DATELIST.length == 0) {
                          longToastMessage(
                              'Nie znaleziono pasującego numeru dla wybranej daty'
                                  .tr);
                        } else {
                          print("object ads is ${interstitialAd}");
                          // if (interstitialAd != null) {
                          //   interstitialAd!.show();
                          // } else {
                          //   Get.snackbar("Error", interstitialAd.toString(),
                          //       snackPosition: SnackPosition.TOP,
                          //       duration: Duration(seconds: 2),
                          //       backgroundColor: Colors.red[300]);
                          // }

                          if(AppConstants.ISADS == true) {
                            interstitialAd!.show();
                          }else{
                            controller.setSuperValues();
                            controller.getValues();
                          }
                        }
                      },
                    ),
                  ),
                  SizedBox(
                    height: Get.height / 25,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class SizeConfig {
  double heightSize(BuildContext context, double value) {
    value /= 100;
    return MediaQuery.of(context).size.height * value;
  }

  double widthSize(BuildContext context, double value) {
    value /= 100;
    return MediaQuery.of(context).size.width * value;
  }
}
