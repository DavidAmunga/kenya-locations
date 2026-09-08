import 'dart:convert';
import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';

/// In-example Dart API that reads the same JSON as the Kotlin/JS/Swift libraries.
///
/// Dart cannot import the Maven JAR. Copy `lib/kenya_locations.dart` into an app,
/// keep `assets/data/` in sync with the repo's `data/` folder, and call [KenyaLocations.load]
/// once at startup.
class KenyaLocations {
  KenyaLocations._({
    required List<County> counties,
    required List<SubCounty> subCounties,
    required List<Constituency> constituencies,
    required List<Ward> wards,
    required List<Locality> localities,
    required List<Area> areas,
  })  : _counties = counties,
        _subCounties = subCounties,
        _constituencies = constituencies,
        _wards = wards,
        _localities = localities,
        _areas = areas;

  final List<County> _counties;
  final List<SubCounty> _subCounties;
  final List<Constituency> _constituencies;
  final List<Ward> _wards;
  final List<Locality> _localities;
  final List<Area> _areas;

  static KenyaLocations? _instance;

  @visibleForTesting
  static void resetForTest() {
    _instance = null;
  }

  static KenyaLocations get instance {
    final loaded = _instance;
    if (loaded == null) {
      throw StateError('Call KenyaLocations.load() before using the instance.');
    }
    return loaded;
  }

  static Future<KenyaLocations> load() async {
    final existing = _instance;
    if (existing != null) return existing;

    Future<List<Map<String, dynamic>>> read(String name) async {
      final raw = await rootBundle.loadString('assets/data/$name');
      return (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    }

    final loaded = KenyaLocations._(
      counties: (await read('counties.json')).map(County.fromJson).toList(),
      subCounties:
          (await read('sub-counties.json')).map(SubCounty.fromJson).toList(),
      constituencies: (await read('constituencies.json'))
          .map(Constituency.fromJson)
          .toList(),
      wards: (await read('wards.json')).map(Ward.fromJson).toList(),
      localities: (await read('locality.json')).map(Locality.fromJson).toList(),
      areas: (await read('area.json')).map(Area.fromJson).toList(),
    );
    _instance = loaded;
    return loaded;
  }

  List<County> getCounties() => _counties;
  List<SubCounty> getSubCounties() => _subCounties;
  List<Constituency> getConstituencies() => _constituencies;
  List<Ward> getWards() => _wards;
  List<Locality> getLocalities() => _localities;
  List<Area> getAreas() => _areas;

  County? getCountyByName(String name) {
    for (final county in _counties) {
      if (county.name == name) return county;
    }
    return null;
  }

  List<Constituency> getConstituenciesInCounty(String countyName) =>
      _constituencies.where((item) => item.county == countyName).toList();

  List<Ward> getWardsInConstituency(String constituencyName) =>
      _wards.where((item) => item.constituency == constituencyName).toList();

  List<Locality> getLocalitiesInCounty(String countyName) =>
      _localities.where((item) => item.county == countyName).toList();

  List<Area> getAreasInLocality(String localityName) =>
      _areas.where((item) => item.locality == localityName).toList();

  /// Typo-tolerant search (same idea as the Kotlin library: substring, then
  /// a Levenshtein window with threshold 0.4).
  List<SearchResult> search(String query, {int limit = 20}) {
    final q = query.trim();
    if (q.length < 2) return [];

    final scored = <({double score, SearchResult result})>[];

    void collect(List<dynamic> items, SearchType type, String Function(dynamic) nameOf) {
      for (final item in items) {
        final score = _fuzzyScore(q, nameOf(item));
        if (score != null) {
          scored.add((score: score, result: SearchResult(type: type, item: item)));
        }
      }
    }

    collect(_counties, SearchType.county, (item) => (item as County).name);
    collect(_subCounties, SearchType.subCounty, (item) => (item as SubCounty).name);
    collect(_constituencies, SearchType.constituency, (item) => (item as Constituency).name);
    collect(_wards, SearchType.ward, (item) => (item as Ward).name);
    collect(_localities, SearchType.locality, (item) => (item as Locality).name);
    collect(_areas, SearchType.area, (item) => (item as Area).name);

    scored.sort((a, b) => a.score.compareTo(b.score));
    return scored.take(limit).map((entry) => entry.result).toList();
  }
}

class County {
  const County({
    required this.code,
    required this.name,
    required this.capital,
    required this.areaKm2,
    required this.population2019,
    required this.region,
    required this.postalCode,
  });

  final String code;
  final String name;
  final String capital;
  final double areaKm2;
  final int population2019;
  final String region;
  final String postalCode;

  factory County.fromJson(Map<String, dynamic> json) => County(
        code: json['code'] as String,
        name: json['name'] as String,
        capital: json['capital'] as String,
        areaKm2: (json['area_km2'] as num).toDouble(),
        population2019: (json['population_2019'] as num).toInt(),
        region: json['region'] as String,
        postalCode: json['postal_code'] as String,
      );

  @override
  bool operator ==(Object other) => other is County && other.code == code;

  @override
  int get hashCode => code.hashCode;
}

class SubCounty {
  const SubCounty({required this.code, required this.name, required this.county});
  final String code;
  final String name;
  final String county;
  factory SubCounty.fromJson(Map<String, dynamic> json) => SubCounty(
        code: json['code'] as String,
        name: json['name'] as String,
        county: json['county'] as String,
      );
}

class Constituency {
  const Constituency({required this.code, required this.name, required this.county});
  final String code;
  final String name;
  final String county;
  factory Constituency.fromJson(Map<String, dynamic> json) => Constituency(
        code: json['code'] as String,
        name: json['name'] as String,
        county: json['county'] as String,
      );

  @override
  bool operator ==(Object other) => other is Constituency && other.code == code;

  @override
  int get hashCode => code.hashCode;
}

class Ward {
  const Ward({required this.code, required this.name, required this.constituency});
  final String code;
  final String name;
  final String constituency;
  factory Ward.fromJson(Map<String, dynamic> json) => Ward(
        code: json['code'] as String,
        name: json['name'] as String,
        constituency: json['constituency'] as String,
      );

  @override
  bool operator ==(Object other) => other is Ward && other.code == code;

  @override
  int get hashCode => code.hashCode;
}

class Locality {
  const Locality({required this.name, required this.county});
  final String name;
  final String county;
  factory Locality.fromJson(Map<String, dynamic> json) => Locality(
        name: json['name'] as String,
        county: json['county'] as String,
      );
}

class Area {
  const Area({required this.name, required this.locality, required this.county});
  final String name;
  final String locality;
  final String county;
  factory Area.fromJson(Map<String, dynamic> json) => Area(
        name: json['name'] as String,
        locality: json['locality'] as String,
        county: json['county'] as String,
      );
}

enum SearchType { county, subCounty, constituency, ward, locality, area }

class SearchResult {
  const SearchResult({required this.type, required this.item});
  final SearchType type;
  final Object item;

  String get name => switch (item) {
        County(:final name) => name,
        SubCounty(:final name) => name,
        Constituency(:final name) => name,
        Ward(:final name) => name,
        Locality(:final name) => name,
        Area(:final name) => name,
        _ => item.toString(),
      };
}

double? _fuzzyScore(String pattern, String text) {
  final p = pattern.toLowerCase();
  final t = text.toLowerCase();
  if (t.contains(p)) return 0;
  if (p.length < 2) return null;

  final maxErrors = math.max(1, (p.length * 0.4).floor());
  final windowSize = p.length + maxErrors;
  var best = double.infinity;

  for (var start = 0; start < t.length; start++) {
    final end = math.min(start + windowSize, t.length);
    final dist = _levenshtein(p, t.substring(start, end));
    if (dist <= maxErrors) {
      final score = dist / p.length;
      if (score < best) best = score;
    }
    if (best == 0) break;
  }

  return best <= 0.4 ? best : null;
}

int _levenshtein(String s, String t) {
  if (s.isEmpty) return t.length;
  if (t.isEmpty) return s.length;
  final dp = List<int>.generate(t.length + 1, (i) => i);
  for (var i = 1; i <= s.length; i++) {
    var prev = dp[0];
    dp[0] = i;
    for (var j = 1; j <= t.length; j++) {
      final temp = dp[j];
      dp[j] = s[i - 1] == t[j - 1] ? prev : 1 + math.min(prev, math.min(dp[j], dp[j - 1]));
      prev = temp;
    }
  }
  return dp[t.length];
}
