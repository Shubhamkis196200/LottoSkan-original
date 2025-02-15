import 'dart:convert';

LottoDateList lottoDateListFromJson(String str) => LottoDateList.fromJson(json.decode(str));

String lottoDateListToJson(LottoDateList data) => json.encode(data.toJson());

class LottoDateList {
  LottoDateList({
    required this.result,
  });

  List<DateResult> result;

  factory LottoDateList.fromJson(Map<String, dynamic> json) => LottoDateList(
    result: List<DateResult>.from(json["result"].map((x) => DateResult.fromJson(x))),
  );

  Map<String, dynamic> toJson() => {
    "result": List<dynamic>.from(result.map((x) => x.toJson())),
  };
}

class DateResult {
  DateResult({
    required this.date,
  });

  DateTime date;

  factory DateResult.fromJson(Map<String, dynamic> json) => DateResult(
    date: DateTime.parse(json["date"]),
  );

  Map<String, dynamic> toJson() => {
    "date": "${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}",
  };
}
