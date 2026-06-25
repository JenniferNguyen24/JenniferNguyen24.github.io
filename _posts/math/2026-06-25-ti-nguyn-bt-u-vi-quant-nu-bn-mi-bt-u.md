---
title: "Tài nguyên để bắt đầu với Quant nếu bạn mới bắt đầu"
date: 2026-06-25
category: math
lang: vi
excerpt: "Tài nguyên Quant để học hỏi"
tags: ["puzzles", "quant"]
---
Tài Nguyên Toàn Diện Cho Phỏng Vấn Quant: Từ Sách Kinh Điển Đến Công Cụ Mới Nhất 2024-2025

Một câu đố quant thường thuộc một trong hai dạng: numeric (đáp số là một con số, xác suất, kỳ vọng, hoặc chứng minh tồn tại/bất khả thi) và algorithmic (đáp số là một quy trình, thủ tục, hoặc chiến lược). Tài liệu dưới đây bao phủ chủ yếu dạng numeric — chiếm phần lớn câu đố trong phỏng vấn quant.

Bài viết này tổng hợp toàn bộ tài nguyên: sách kinh điển, các đầu sách mới ra trong 2024-2025, nền tảng online, GitHub repositories, và lộ trình học cụ thể.

## Tầng 1 — Phỏng Vấn Quant 

Các sách viết riêng cho phỏng vấn quant, tập trung 80% vào xác suất, kỳ vọng, và câu đố tư duy nhanh. Tuy nhiên gần như không dạy cách giải mà chủ yếu là đưa bài toán rồi arrange thôi. 

`Xinfeng Zhou — A Practical Guide to Quantitative Finance Interviews`. Còn được gọi là Green Book, gần như là chuẩn de facto cho phỏng vấn quant ở Mỹ. Có chương riêng về brain teasers, xác suất, ngẫu nhiên rời rạc, ngẫu nhiên liên tục. Lời giải chi tiết, thường nhiều cách tiếp cận. 💯

`Timothy Crack — Heard on the Street: Quantitative Questions from Wall Street Job Interviews.` Cập nhật liên tục qua hơn 20 ấn bản. Vừa có câu đố vừa có câu hỏi tài chính và lập trình thực tế. Đa dạng hơn Zhou nhưng kém hệ thống hơn.

`Mark Joshi — Quant Job Interview Questions and Answers`. Cô đọng, đi thẳng vào trọng tâm. Có phần riêng về toán tài chính (Black-Scholes, định giá) nếu bạn nhắm vào derivatives hoặc quant trading.

`Dan Stefanica, Radoš Radoičić, Tai-Ho Wang — 150 Most Frequently Asked Questions on Quant Interviews (Ấn bản 3, FE Press 2024)`. Cực gọn. Ấn bản mới nhất 2024, 331 trang. Tốt để rà soát lần cuối trước phỏng vấn.

`Radoš Radoičić, Ivan Matić, Dan Stefanica — Challenging Brainteasers for Interviews (FE Press 2023)`. 165 câu đố phân loại theo Aha Questions (câu nhanh và logic xoắn não), câu đố xác suất, câu đố tổ hợp (đếm và thuật toán), và câu đố toán học (số học, hình học, giải tích, đại số tuyến tính). Đây là cuốn thứ ba trong bộ Pocket Book Guides for Quant Interviews của Baruch.

`Dan Stefanica — Admissions IQ: MFE Interview Edition (FE Press 2025).` Dành riêng cho việc xét tuyển vào các chương trình Master of Financial Engineering. Hữu ích nếu bạn đang nộp đơn vào MFE.

## Tầng 2 — Nền Tảng Xác Suất Và Toán Câu Đố

Sách kinh điển, không phải prep book nhưng là nguồn của hầu hết câu đố phỏng vấn.

`Frederick Mosteller — Fifty Challenging Problems in Probability with Solutions.` Mỏng, khoảng 50 bài, mỗi bài là một viên kim cương. Bài bẻ que, ba thợ săn, Monty Hall, Buffon needle — rất nhiều câu phỏng vấn đến từ đây. Đáng đọc đi đọc lại.

`William Feller — An Introduction to Probability Theory and Its Applications, Vol. 1.` Sách giáo trình kinh điển nhất. Khô nhưng toàn diện. Nếu bạn yếu nền xác suất rời rạc, đây là chỗ chữa.

`Sheldon Ross — A First Course in Probability.` Dễ tiếp cận hơn Feller, nhiều bài tập, phù hợp tự học.

`Frederick Mosteller, Robert Rourke, George Thomas` — Probability with Statistical Applications. Cũ nhưng có nhiều bài đẹp.

`Andrea Pascucci — Probability Theory II (2024)`. Sách mới 2024, đi sâu vào các quá trình ngẫu nhiên thời gian liên tục, tập trung vào stochastic calculus. Có liên kết mạnh với phương trình vi phân riêng phần. Hữu ích cho các vai trò liên quan tới định giá phái sinh.

`Paolo Baldi — Probability (2024, 400 trang)`. Nối lý thuyết độ đo với xác suất, hơn 150 bài tập có lời giải. Phù hợp nếu bạn đã có nền lý thuyết độ đo và muốn chuẩn bị cho stochastic calculus.

`Wolf Schwarz — 40 Puzzles and Problems in Probability and Mathematical Statistics.` Được viết theo truyền thống Mosteller, nhiều bài về thống kê hơn các sách câu đố thông thường. Hữu ích như một bổ sung cho Mosteller.

## *Tầng 3 — Kỹ Thuật Giải Câu Đố Tổng Quát*

*Đây là các sách dạy cách suy nghĩ, không phải lưu trữ câu đố. Cải thiện kỹ năng nhận diện kỹ thuật, là cốt lõi để giỏi câu đố*. <- Thật ra là sách nên được đọc đầu tiên

`Paul Zeitz — The Art and Craft of Problem Solving`. Cuốn quan trọng nhất trong danh sách này nếu bạn muốn lên tầm. Mỗi chương một kỹ thuật (bất biến, đối xứng, cực trị, đếm hai cách…) với rất nhiều ví dụ minh họa từ olympic.

`Arthur Engel — Problem-Solving Strategies`. Cấp độ olympic toán. Chương về bất biến, tô màu, nguyên lý cực trị chính xác là các kỹ thuật cốt lõi để giải câu đố. Khó hơn Zeitz nhưng ví dụ phong phú hơn.

`George Pólya — How to Solve It`. Mỏng, kinh điển, viết từ 1945 nhưng vẫn đứng vững. Không cho bạn nhiều bài, nhưng dạy quy trình tư duy khi gặp bài lạ.

`Loren Larson — Problem-Solving Through Problems.` Sắp xếp theo kỹ thuật, có lời giải. Một lựa chọn thay Zeitz hoặc Engel.

Tầng 4 — Tuyển Tập Câu Đố Cổ Điển

Để có cảm giác rộng và bắt gặp các bài thường được tái sử dụng trong phỏng vấn.

`Peter Winkler — Mathematical Puzzles`: Revised Edition (CRC Press, tháng 6/2024). Đây là tin lớn nhất của 2024. Ấn bản thứ hai, 450 trang, được biên tập kỹ lại để sửa lỗi và làm rõ, có một số lời giải hoàn toàn mới và một câu đố hoàn toàn mới. Đặc biệt phù hợp với cách học theo kỹ thuật: các chương được tổ chức theo phương pháp giải — Achieving Parity, The Pigeonhole Principle, Great Expectation, Brilliant Induction, Nimbers and the Hamming Code, v.v. Mỗi chương trình bày một kỹ thuật, các ví dụ, rồi một định lý toán học thật sự dùng kỹ thuật đó trong chứng minh. Nếu chỉ mua một cuốn mới năm 2024, đây là cuốn đó.

`Peter Winkler — Mathematical Mind-Benders.` Cuốn câu đố cổ điển khác của Winkler, từ vừa đến cực khó, với lời giải đẹp. Bài đàn kiến, bài 100 tù nhân và hộp, nhiều bài kinh điển khó đến từ đây hoặc được Winkler tinh chỉnh.

`Martin Gardner `— toàn bộ tuyển tập Mathematical Games columns từ Scientific American. Có hơn 15 cuốn. The Colossal Book of Mathematics và The Colossal Book of Short Puzzles and Problems là hai cuốn tổng hợp tốt nhất nếu bạn chỉ chọn được hai cuốn. (Đọc gần xong short puzzles) 💯

`Dennis Shasha `— Puzzles for Programmers and Pros. Định hướng thuật toán/tin học nhưng nhiều bài là numeric thuần.

`Boris Kordemsky — The Moscow Puzzles`. Câu đố Liên Xô cổ điển, dễ đọc, đa dạng. 💯

`Yakov Perelman — Mathematics Can Be Fun`. Cùng dòng Nga, có nhiều bài ngụy trang khéo. 

Tầng 5 — Nền Tảng Online Và Tương Tác

`quantguide.io `— phiên bản mới hơn và tốt hơn của Brainstellar. Kiểu Leetcode cho quant với câu đố phân loại theo công ty. Cho phép lọc theo Jane Street, Citadel, Two Sigma, v.v. Cực kỳ hữu ích trong tuần cuối trước phỏng vấn.

`QuantQuestions.app (2025)` — giải quyết một hạn chế cấu trúc của việc chuẩn bị bằng sách: phỏng vấn quant là bằng lời và đối kháng, đọc lời giải không dạy bạn cách nói ra đáp án dưới áp lực. Luyện phỏng vấn mock dựa trên AI.

`Quantapus` — miễn phí, lấy từ Green Book và các nguồn khác, có cấu trúc rõ ràng và lời giải. Điểm khởi đầu tốt.

Brainstellar (brainstellar.com) — trang câu đố miễn phí lâu đời, vẫn còn hữu ích cho người mới. Phân chia theo độ khó (Easy, Medium, Hard) và theo chủ đề (Probability, Discrete Maths, Strategy).

Jane Street puzzles — câu đố tháng miễn phí trên website Jane Street. Được đánh giá là cao hơn một bậc so với phỏng vấn thông thường, đòi hỏi cả chiều sâu và sự linh hoạt. Tuyệt vời để giữ độ sắc.

Brilliant.org — khóa học có hướng dẫn về xác suất, lý thuyết trò chơi, lập luận logic. Tương tác, tốt cho người mới.

Project Euler — thiên về số học/lập trình nhưng nhiều bài cần tư duy kiểu câu đố trước khi viết code. Miễn phí.


QuantNet và Wilmott forums — diễn đàn về phỏng vấn quant. Có thread sưu tầm câu hỏi thực tế từ các interview gần đây.

Glassdoor — tìm Jane Street interview, Citadel interview, Two Sigma interview. Ứng viên chia sẻ câu hỏi thật. Chất lượng dao động nhưng cho cảm giác style hỏi của từng quỹ.

Sarah Chieng's blog — được giới thiệu trong các thread prep 2025, có nội dung phỏng vấn quant chất lượng.

Zetamac (arithmetic.zetamac.com) — trang luyện mental math miễn phí. Baseline 50, peak 60 ở cài đặt mặc định là mục tiêu. Phỏng vấn trading đặc biệt nặng về phần này.

RankYourBrain — luyện toán nhanh với phân số và số thập phân.

OpenQuant Mental Math — bộ trò chơi luyện toán arithmetic và sequence để chuẩn bị cho online assessment của quant trader và quant researcher.

Tầng 6 — GitHub Repositories Và Tài Nguyên Miễn Phí

Đây là phần thường bị bỏ qua nhưng cực kỳ giá trị.

QuantitativePrimer (github.com/dwcoder/QuantitativePrimer) — file PDF miễn phí trên GitHub, được dân quant gần đây hay chia sẻ như một lựa chọn thay thế cho các sách prep cổ điển. Bao phủ rộng, có lời giải chi tiết.

Aniruddha-Deb/quant-prep (github.com/Aniruddha-Deb/quant-prep) — repo tổng hợp tài nguyên và nhật ký chuẩn bị phỏng vấn quant. Cập nhật gần nhất 2025. Có đánh giá thẳng thắn về từng cuốn sách và nền tảng, theo trải nghiệm thực tế của tác giả khi đi phỏng vấn.

quant-bobby/quant-jobs (github.com/quant-bobby/quant-jobs) — hướng dẫn toàn diện để tìm việc và internship trong quant finance. Bao gồm danh sách công ty, mức lương cộng đồng, các nguồn tham khảo.

Tầng 7 — Chuyên Sâu Theo Chủ Đề

Nếu bạn muốn đào riêng một nhóm.

Cho lý thuyết trò chơi tổ hợp (Nim, Sprague-Grundy): Berlekamp, Conway, Guy — Winning Ways for Your Mathematical Plays. Bốn tập, cực kinh điển. Hoặc bản gọn hơn: Aaron Siegel — Combinatorial Game Theory.

Cho martingale và quá trình ngẫu nhiên nâng cao: David Williams — Probability with Martingales.

Cho thuật toán Monte Carlo Markov Chain: C. Douglas Howard — The Metropolis Algorithm: Theory and Examples (FE Press, tháng 5/2024). Sách mỏng, phát triển nhanh lý thuyết Markov chain ergodic, giải thích thuật toán Metropolis, và đưa ra 8 ứng dụng từ Sudoku solver đến Traveling Salesman. Mã nguồn đi kèm tại github.com/CDouglasHoward13/Metropolis.

Cho lý thuyết thông tin và câu đố cân: Thomas Cover — Elements of Information Theory (chính là Cover trong chiến lược Cover của câu đố hai mảnh giấy).

Cho lập luận về kiến thức (mắt xanh đảo, common knowledge): Fagin, Halpern, Moses, Vardi — Reasoning About Knowledge. Hàn lâm nhưng đầy đủ.


Lộ Trình Chuẩn Bị

Nếu bạn đang chuẩn bị phỏng vấn quant trong vài tháng tới.

Tuần 1-6, nền móng. Đọc Zhou (Green Book) từ đầu đến cuối, làm hết bài tập. Song song mỗi tối luyện Zetamac để build tốc độ mental math (mục tiêu baseline 50).

Nếu Bạn Muốn Giỏi Lâu Dài

Mục tiêu xa hơn — giỏi câu đố như một kỹ năng suốt đời, không chỉ vượt phỏng vấn: Zeitz cộng Winkler cộng Gardner là bộ ba ăn ở cả đời. Zeitz dạy bạn kỹ thuật, Winkler cho bạn các câu đố đỉnh cao đã được tinh lọc qua nhiều thập kỷ, Gardner cho bạn lịch sử và bề rộng của truyền thống câu đố toán học. Đọc rải rác, không vội, một bài mỗi tối — sau vài năm bạn sẽ thấy mình nhận diện cấu trúc của bất kỳ câu đố nào trong vài giây.