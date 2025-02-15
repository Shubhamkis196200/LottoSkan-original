// To parse this JSON data, do
//
//     final lottoList = lottoListFromJson(jsonString);

import 'dart:convert';

LottoList lottoListFromJson(String str) => LottoList.fromJson(json.decode(str));

String lottoListToJson(LottoList data) => json.encode(data.toJson());

class LottoList {
  LottoList({
     required this.message,
     required this.result,
  });

  String message;
  Result result;

  factory LottoList.fromJson(Map<String, dynamic> json) => LottoList(
    message: json["message"],
    result: Result.fromJson(json["result"]),
  );

  Map<String, dynamic> toJson() => {
    "message": message,
    "result": result.toJson(),
  };
}

class Result {
  Result({
     required this.docs,
     required this.totalDocs,
     required this.limit,
     required this.page,
     required this.totalPages,
     required this.pagingCounter,
     required this.hasPrevPage,
     required this.hasNextPage,
     required this.prevPage,
     required this.nextPage,
  });

  List<Doc> docs;
  int totalDocs;
  int limit;
  int page;
  int totalPages;
  int pagingCounter;
  bool hasPrevPage;
  bool hasNextPage;
  dynamic prevPage;
  dynamic nextPage;

  factory Result.fromJson(Map<String, dynamic> json) => Result(
    docs: List<Doc>.from(json["docs"].map((x) => Doc.fromJson(x))),
    totalDocs: json["totalDocs"],
    limit: json["limit"],
    page: json["page"],
    totalPages: json["totalPages"],
    pagingCounter: json["pagingCounter"],
    hasPrevPage: json["hasPrevPage"],
    hasNextPage: json["hasNextPage"],
    prevPage: json["prevPage"],
    nextPage: json["nextPage"],
  );

  Map<String, dynamic> toJson() => {
    "docs": List<dynamic>.from(docs.map((x) => x.toJson())),
    "totalDocs": totalDocs,
    "limit": limit,
    "page": page,
    "totalPages": totalPages,
    "pagingCounter": pagingCounter,
    "hasPrevPage": hasPrevPage,
    "hasNextPage": hasNextPage,
    "prevPage": prevPage,
    "nextPage": nextPage,
  };
}

class Doc {
  Doc({
     required this.id,
     required this.flag,
     required this.lotteryName,
     required this.lotteryNumber,
     required this.superBtn,
     required this.scan,
     required this.lotteryImage,
     required this.note,
     required this.regex,
  });

  String id;
  int flag;
  String lotteryName;
  String lotteryNumber;
  int superBtn;
  int scan;
  String lotteryImage;
  String note;
  int regex;

  factory Doc.fromJson(Map<String, dynamic> json) => Doc(
    id: json["_id"],
    flag: json["flag"],
    lotteryName: json["lottery_name"],
    lotteryNumber: json["lottery_number"],
    superBtn: json["super_btn"],
    scan: json["scan"],
    lotteryImage: json["lottery_image"],
    note: json["note"],
    regex: json["regex"],
  );

  Map<String, dynamic> toJson() => {
    "_id": id,
    "flag": flag,
    "lottery_name": lotteryName,
    "lottery_number": lotteryNumber,
    "super_btn": superBtn,
    "scan": scan,
    "lottery_image": lotteryImage,
    "note": note,
    "regex": regex,
  };
}
