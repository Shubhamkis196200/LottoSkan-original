import 'package:adaptive_action_sheet/adaptive_action_sheet.dart';
import 'package:flutter/material.dart';
import 'package:flutter_exif_rotation/flutter_exif_rotation.dart';
import 'package:get/get.dart';
import 'package:google_ml_vision/google_ml_vision.dart';
import 'package:image_picker/image_picker.dart';
import 'package:lotto_app/Api/mlApis.dart';
import 'package:lotto_app/Common/Colors.dart';
import 'package:lotto_app/Common/app_theme.dart';
import 'package:lotto_app/Common/widget.dart';
import 'package:lotto_app/Controller/lotto_listing_controller.dart';
import 'package:lotto_app/Utils/appConstants.dart';
import 'package:lotto_app/Utils/myToasts.dart';
import 'package:lotto_app/Widgets/controls_widget.dart';
import 'dart:io';
import 'confirmation_screen.dart';

class LottoListing extends StatefulWidget {
  @override
  State<LottoListing> createState() => _LottoListingState();
}

class _LottoListingState extends State<LottoListing> {
  int? regexNumber;
  int? superBtn;

  String text = '';
  String title = '';
  late GoogleVisionImage image;
  File? imageFile;

  @override
  Widget build(BuildContext context) {
    final controller = Get.put(LottoListingController());
    return Scaffold(
      backgroundColor: blue,
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(80),
        child: AppBar(
          automaticallyImplyLeading: false,
          elevation: 0,
          backgroundColor: yellow,
          centerTitle: true,
          title: Container(
            margin: EdgeInsets.only(top: 18),
            child: Text('wybierzgre'.tr, style: headline),
          ),
        ),
      ),
      body: Obx(
        () {
          return controller.isLoading.value
              ? Center(
                  child: CircularProgressIndicator(
                  color: yellow,
                ))
              : RefreshIndicator(
            onRefresh: () async {
              controller.getSettingApi();
            },
            child: Column(
              mainAxisSize: MainAxisSize.max,
              children: [
                SizedBox(
                  height: Get.height / 80,
                ),
                Expanded(
                  child: ListView.builder(
                      shrinkWrap: true,
                      itemCount: controller.LOTTODATALIST.length, //lottoList.length,
                      itemBuilder: (context, index) {
                        return customCard(
                          //controller.LOTTODATALIST[index].lotteryImage,
                          "Assets/${controller.LOTTOCOMMONTIMGLIST[index]}",
                          controller.LOTTODATALIST[index].lotteryName,
                          Container(
                            width: 85,
                            child: ControlsWidget(
                              onClickedPickImage: () {
                                emptyData(index, controller);
                                regexNumber = controller.LOTTODATALIST[index].regex;
                                superBtn = controller.LOTTODATALIST[index].superBtn;
                                AppConstants.TICKETID = controller.LOTTODATALIST[index].id;
                                title = controller.LOTTODATALIST[index].lotteryName;
                                if (controller.LOTTODATALIST[index].scan == 1 &&
                                    controller.LOTTODATALIST[index].superBtn == 1) {
                                  AppConstants.isSuperBtn.value = true;
                                  cameraAction();
                                } else if (controller.LOTTODATALIST[index].scan == 1 &&
                                    controller.LOTTODATALIST[index].superBtn == 2) {
                                  AppConstants.isSuperBtn.value = false;
                                  cameraAction();
                                } else if (controller.LOTTODATALIST[index].scan == 2 &&
                                    controller.LOTTODATALIST[index].superBtn == 1) {
                                  AppConstants.isSuperBtn.value = true;
                                  AppConstants.TICKET_LIST = [""];
                                  Get.to(ConfirmationScreen(/*title: title*/));
                                } else if (controller.LOTTODATALIST[index].scan == 2 &&
                                    controller.LOTTODATALIST[index].superBtn == 2) {
                                  AppConstants.isSuperBtn.value = false;
                                  AppConstants.TICKET_LIST = [""];
                                  Get.to(ConfirmationScreen(/*title: title*/));
                                }
                              }, //cameraAction,
                              onClickedScanText: scanText,
                              onClickedClear: clear,
                            ),
                          ),
                        );
                      }),
                )
              ],
            ),
          );
        },
      ),
    );
  }

  emptyData(index , controller) {
    AppConstants.NOTEVALUE = [];
    List value = [];
    value.add(controller.LOTTODATALIST[index].note);
    AppConstants.NOTEVALUE = value[0].split(',');
    print("NOTEVALUE is ${AppConstants.NOTEVALUE}");
    AppConstants.SUPERNUMBERLIST = [];
    AppConstants.SUPERNUMBERS= [];
    AppConstants.isSuperBtn.value = false;
    AppConstants.FINAL_LIST = [];
    AppConstants.TICKET_LIST = [];
    AppConstants.TICKET_LIST2 = [];
    AppConstants.TICKETID = '';
  }

  //Camera Actions
  cameraAction() {
    showAdaptiveActionSheet(
      context: context,
      title: Text(
        'selectOption'.tr,
        style: TextStyle(fontSize: 25, color: blue),
      ),
      actions: <BottomSheetAction>[
        BottomSheetAction(
          title: Text('camera'.tr,
              style: TextStyle(color: blue)
          ),
          onPressed: () {
            Get.back();
            captureImage();
          },
        ),
        BottomSheetAction(
          title: Text(
            'Gallery'.tr,
            style: TextStyle(color: blue),
          ),
          onPressed: () {
            Get.back();
            pickImage();
          },
        )
      ],
      cancelAction: CancelAction(
        title: Text('cancel'.tr, style: TextStyle(color: blue),),
        onPressed: () {
          Get.back();
        },
      ),
    );
  }

  Future pickImage() async {
    final file = await ImagePicker().pickImage(source: ImageSource.gallery);
    setState(() {
      imageFile = File(file!.path);
    });

    if (Platform.isIOS){
      var file2 = await FlutterExifRotation.rotateImage(path: file!.path);
      setImage(GoogleVisionImage.fromFilePath(file2.path));
    } else {
      setImage(GoogleVisionImage.fromFilePath(file!.path));
    }
  }

  Future captureImage() async {
    final file = await ImagePicker().pickImage(source: ImageSource.camera);
    setState(() {
      imageFile = File(file!.path);
    });
    if (Platform.isIOS) {
      var file2 = await FlutterExifRotation.rotateImage(path: file!.path);
      setImage(GoogleVisionImage.fromFilePath(file2.path));
    } else {
      setImage(GoogleVisionImage.fromFilePath(file!.path));
    }
  }

  Future scanText() async {
    showDialog(
      context: context,
      builder: (context) {
        return Visibility(
          visible: true,
          child: Center(
            child: CircularProgressIndicator(
              color: yellow,
            ),
          ),
        );
      },
    );
    final text = await MlApis.recogniseText(image, AppConstants.TICKETID);
    setText(text);

    print("Ticket ==>${AppConstants.TICKET_LIST}");
    print("Ticket22 ==>${AppConstants.TICKET_LIST2}");

    if(superBtn == 1){
      AppConstants.isSuperBtn.value = true;
    }else{
      AppConstants.isSuperBtn.value = false;
    }
    if (AppConstants.TICKETID == "61dbf513cc484f2c593b395d" && AppConstants.TICKET_LIST.length > 0) {
      Get.offAll(ConfirmationScreen(/*title: title*/));
    } else if (AppConstants.TICKETID == "61dbf75ecc484f2c593b3970" || AppConstants.TICKETID == "61dbf7a2cc484f2c593b3973"
        && AppConstants.TICKET_LIST.length > 0){
      Get.offAll(ConfirmationScreen(/*title: title*/));
    } else {
      if (AppConstants.TICKET_LIST.length > 0) {
        AppConstants.TICKET_LIST2 = [];
        Get.offAll(ConfirmationScreen(/*title: title*/));
      } else {
        longToastMessage('unableToScan'.tr);
        Get.back();
      }
    }
  }

  void clear() {
    setImage(null);
    setText('');
  }

  void setImage(GoogleVisionImage? newImage) {
    setState(() {
      image = newImage!;
    });
    scanText();
  }

  void setText(String newText) {
    setState(() {
      text = newText;
    });
  }
}
