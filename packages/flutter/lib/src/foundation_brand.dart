// 由 contracts/foundation.v1.json 生成，禁止手改。
import 'package:flutter/material.dart';

abstract final class WenyouBrandContract {
  static const String name = '温油站';
  static const String tagline = '最温油的文字共创社区';
  static const String symbolAsset = 'brand_assets/runtime/logo-symbol-transparent-1024.png';
  static const double startupMarkSize = 96.0;
  static const double authMarkSize = 48.0;
  static const double appBarMarkSize = 24.0;
}

class WenyouBrandMark extends StatelessWidget {
  const WenyouBrandMark.decorative({
    this.size = WenyouBrandContract.appBarMarkSize,
    super.key,
  }) : semanticLabel = null;

  const WenyouBrandMark.semantic({
    required this.semanticLabel,
    this.size = WenyouBrandContract.appBarMarkSize,
    super.key,
  });

  final double size;
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final cacheSize = (size * MediaQuery.devicePixelRatioOf(context)).ceil();
    return SizedBox.square(
      dimension: size,
      child: Image.asset(
        WenyouBrandContract.symbolAsset,
        package: 'wenyousite_foundation',
        width: size,
        height: size,
        fit: BoxFit.contain,
        filterQuality: FilterQuality.high,
        cacheWidth: cacheSize,
        cacheHeight: cacheSize,
        excludeFromSemantics: semanticLabel == null,
        semanticLabel: semanticLabel,
      ),
    );
  }
}
