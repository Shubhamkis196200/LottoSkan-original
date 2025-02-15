import 'package:flutter/material.dart';
import 'package:lotto_app/Common/Colors.dart';
import 'package:get/get.dart';

class ControlsWidget extends StatelessWidget {
  final VoidCallback onClickedPickImage;
  final VoidCallback onClickedScanText;
  final VoidCallback onClickedClear;

  const ControlsWidget({
    required this.onClickedPickImage,
    required this.onClickedScanText,
    required this.onClickedClear,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) => Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          GestureDetector(
            onTap: onClickedPickImage,
            child: Container(
              child: Card(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(150),
                ),
                color: yellow,
                child: Container(
                    padding: EdgeInsets.symmetric(horizontal: 18, vertical: 2),
                    child: Text('skan'.tr)),
              ),
            ),
          )
        ],
      );
}
