package expo.modules.kakaouser

import java.util.Date

val Date.unix: Long
    get() = time / 1000

fun diffSec(di: Date, d2:Date):Long = (di.time - d2.time) / 1000L