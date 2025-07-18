import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      "nav.signup": "SIGN UP",
      "nav.login": "LOGIN →",
      "nav.payNow": "Pay Now",
      "nav.business": "Business",
      "nav.logout": "Logout",
      "nav.tutorial": "Tutorial",
      
      // Hero Section
      "hero.title": "The Future of",
      "hero.titleHighlight": "Digital Payments",
      "hero.subtitle": "Experience seamless, secure payments with face recognition and QR code technology. Fast, reliable, and built for the modern world.",
      "hero.getStarted": "Get Started →",
      "hero.learnMore": "Learn More",
      
      // Features
      "features.title": "Experience Next-Gen Payment Features",
      "features.faceRecognition.title": "Face Recognition",
      "features.faceRecognition.description": "Secure biometric authentication for instant payments. No cards, no cash, just your face.",
      "features.qrCode.title": "QR Code Payments",
      "features.qrCode.description": "Quick and easy QR code scanning for contactless payments anywhere, anytime.",
      "features.eInvoicing.title": "E-Invoicing",
      "features.eInvoicing.description": "Automatic invoice generation and digital receipts for every transaction.",
      
      // Demo Section
      "demo.title": "Try the Demo",
      "demo.description": "Experience our payment simulation with mock data. No real money involved!",
      "demo.startButton": "Start Demo Payment",
      
      // Footer
      "footer.copyright": "© 2025 PayID - Digital Payment Platform",
      
      // Tutorial
      "tutorial.welcome": "Welcome to Your Dashboard!",
      "tutorial.welcomeDesc": "This is your main dashboard where you can monitor your business performance and manage transactions.",
      "tutorial.analytics": "Analytics Overview",
      "tutorial.analyticsDesc": "These cards show your key business metrics including total revenue, invoices, transactions, and success rate.",
      "tutorial.revenueChart": "Revenue Chart",
      "tutorial.revenueChartDesc": "Track your daily revenue performance over the last 7 days. This helps you identify trends and patterns.",
      "tutorial.qrCode": "Business QR Code",
      "tutorial.qrCodeDesc": "Your unique DuitNow QR code for receiving payments. Customers can scan this to pay you directly.",
      "tutorial.transactions": "Recent Transactions",
      "tutorial.transactionsDesc": "View your latest payment transactions. You can see payment methods, amounts, and transaction status.",
      "tutorial.invoices": "Recent Invoices",
      "tutorial.invoicesDesc": "Manage your invoices here. Click on any invoice to view detailed information or create new ones.",
      "tutorial.createInvoice": "Create New Invoice",
      "tutorial.createInvoiceDesc": "Click here to create a new invoice for your customers. You can customize all the details and send it via email.",
      "tutorial.landingWelcome": "Welcome to Catching!",
      "tutorial.landingWelcomeDesc": "Your digital payment platform for the future. Experience seamless payments with face recognition and QR codes.",
      "tutorial.features": "Our Features",
      "tutorial.featuresDesc": "Discover our three main features: Face Recognition, QR Code Payments, and E-Invoicing.",
      "tutorial.demo": "Try the Demo",
      "tutorial.demoDesc": "Test our payment system with mock data. No real money involved - perfect for exploring the features!",
      "tutorial.startPayment": "Start Payment",
      "tutorial.startPaymentDesc": "Click here to begin a payment transaction. You can choose between face recognition or QR code payment.",
      "tutorial.paymentMethod": "Choose Payment Method",
      "tutorial.paymentMethodDesc": "Select your preferred payment method: Face Recognition for biometric authentication or QR Code for quick scanning.",
      "tutorial.amount": "Enter Amount",
      "tutorial.amountDesc": "Input the payment amount in Malaysian Ringgit (MYR). The system will validate and process your payment.",
      "tutorial.processPayment": "Process Payment",
      "tutorial.processPaymentDesc": "Click here to process your payment. You'll be redirected to the success page with your receipt and invoice.",
      "tutorial.invoiceDetails": "Invoice Details",
      "tutorial.invoiceDetailsDesc": "This is your detailed e-invoice with all transaction information, company details, and payment breakdown.",
      "tutorial.invoiceActions": "Invoice Actions",
      "tutorial.invoiceActionsDesc": "Download your invoice as PDF or share it via email. Perfect for record keeping and business documentation.",
      "tutorial.skip": "Skip Tutorial",
      "tutorial.remindLater": "Remind Me Later",
      "tutorial.back": "Back",
      "tutorial.next": "Next",
      "tutorial.finish": "Finish",
      "tutorial.close": "Close",
      
      // Dashboard
      "dashboard.title": "Dashboard",
      "dashboard.totalBalance": "Total Balance",
      "dashboard.monthlyIncome": "Monthly Income",
      "dashboard.monthlyExpenses": "Monthly Expenses",
      "dashboard.recentTransactions": "Recent Transactions",
      "dashboard.quickActions": "Quick Actions",
      "dashboard.sendMoney": "Send Money",
      "dashboard.requestMoney": "Request Money",
      "dashboard.payBills": "Pay Bills",
      "dashboard.viewAll": "View All",
      "dashboard.walletsAccounts": "Wallets & Accounts",
      "dashboard.myBalance": "My Balance",
      "dashboard.income": "Income",
      "dashboard.expenses": "Expenses",
      "dashboard.manageWallets": "Manage your wallets and transactions",
      
      // Settings
      "settings.title": "Settings",
      "settings.profile": "Profile Settings",
      "settings.security": "Security",
      "settings.notifications": "Notifications",
      "settings.language": "Language",
      "settings.save": "Save Changes",
      
      // Common
      "common.loading": "Loading...",
      "common.error": "Error",
      "common.success": "Success",
      "common.cancel": "Cancel",
      "common.confirm": "Confirm",
      "common.back": "Back",
      "common.next": "Next",
      "common.submit": "Submit",
      "common.close": "Close",
      
      // Payment
      "payment.amount": "Amount",
      "payment.recipient": "Recipient",
      "payment.description": "Description",
      "payment.send": "Send Payment",
      "payment.success": "Payment Successful",
      "payment.failed": "Payment Failed",
      
      // Invoice
      "invoice.title": "Invoice",
      "invoice.number": "Invoice Number",
      "invoice.date": "Date",
      "invoice.dueDate": "Due Date",
      "invoice.total": "Total",
      "invoice.download": "Download",
      "invoice.send": "Send",
      "invoice.paid": "Paid",
      "invoice.pending": "Pending",
    }
  },
  zh: {
    translation: {
      // Navigation
      "nav.signup": "注册",
      "nav.login": "登录 →",
      "nav.payNow": "立即支付",
      "nav.business": "商业",
      "nav.logout": "登出",
      
      // Hero Section
      "hero.title": "数字支付的",
      "hero.titleHighlight": "未来",
      "hero.subtitle": "体验无缝、安全的人脸识别和二维码技术支付。快速、可靠，为现代世界而建。",
      "hero.getStarted": "开始使用 →",
      "hero.learnMore": "了解更多",
      
      // Features
      "features.title": "体验下一代支付功能",
      "features.faceRecognition.title": "人脸识别",
      "features.faceRecognition.description": "安全的生物识别认证，实现即时支付。无需卡片，无需现金，只需您的面部。",
      "features.qrCode.title": "二维码支付",
      "features.qrCode.description": "快速简便的二维码扫描，随时随地进行非接触式支付。",
      "features.eInvoicing.title": "电子发票",
      "features.eInvoicing.description": "每笔交易自动生成发票和数字收据。",
      
      // Demo Section
      "demo.title": "试用演示",
      "demo.description": "使用模拟数据体验我们的支付模拟。不涉及真实资金！",
      "demo.startButton": "开始演示支付",
      
      // Footer
      "footer.copyright": "© 2025 PayID - 数字支付平台",
      
      // Tutorial
      "tutorial.welcome": "欢迎来到您的仪表板！",
      "tutorial.welcomeDesc": "这是您的主仪表板，您可以在这里监控业务绩效和管理交易。",
      "tutorial.analytics": "分析概览",
      "tutorial.analyticsDesc": "这些卡片显示您的关键业务指标，包括总收入、发票、交易和成功率。",
      "tutorial.revenueChart": "收入图表",
      "tutorial.revenueChartDesc": "跟踪过去7天的每日收入表现。这有助于您识别趋势和模式。",
      "tutorial.qrCode": "商业二维码",
      "tutorial.qrCodeDesc": "您独特的DuitNow二维码用于接收付款。客户可以扫描此码直接向您付款。",
      "tutorial.transactions": "最近交易",
      "tutorial.transactionsDesc": "查看您最新的付款交易。您可以看到付款方式、金额和交易状态。",
      "tutorial.invoices": "最近发票",
      "tutorial.invoicesDesc": "在这里管理您的发票。点击任何发票查看详细信息或创建新发票。",
      "tutorial.createInvoice": "创建新发票",
      "tutorial.createInvoiceDesc": "点击这里为您的客户创建新发票。您可以自定义所有详细信息并通过电子邮件发送。",
      "tutorial.landingWelcome": "欢迎来到Catching！",
      "tutorial.landingWelcomeDesc": "您的未来数字支付平台。体验人脸识别和二维码的无缝支付。",
      "tutorial.features": "我们的功能",
      "tutorial.featuresDesc": "发现我们的三个主要功能：人脸识别、二维码支付和电子发票。",
      "tutorial.demo": "试用演示",
      "tutorial.demoDesc": "使用模拟数据测试我们的支付系统。不涉及真实资金 - 非常适合探索功能！",
      "tutorial.startPayment": "开始支付",
      "tutorial.startPaymentDesc": "点击这里开始支付交易。您可以选择人脸识别或二维码支付。",
      "tutorial.paymentMethod": "选择支付方式",
      "tutorial.paymentMethodDesc": "选择您首选的支付方式：人脸识别进行生物识别认证或二维码进行快速扫描。",
      "tutorial.amount": "输入金额",
      "tutorial.amountDesc": "输入马来西亚林吉特（MYR）的支付金额。系统将验证并处理您的支付。",
      "tutorial.processPayment": "处理支付",
      "tutorial.processPaymentDesc": "点击这里处理您的支付。您将被重定向到成功页面，并获得收据和发票。",
      "tutorial.invoiceDetails": "发票详情",
      "tutorial.invoiceDetailsDesc": "这是您详细的电子发票，包含所有交易信息、公司详情和付款明细。",
      "tutorial.invoiceActions": "发票操作",
      "tutorial.invoiceActionsDesc": "下载您的发票为PDF或通过电子邮件分享。非常适合记录保存和业务文档。",
      "tutorial.skip": "跳过教程",
      "tutorial.remindLater": "稍后提醒",
      "tutorial.back": "返回",
      "tutorial.next": "下一步",
      "tutorial.finish": "完成",
      "tutorial.close": "关闭",
      
      // Dashboard
      "dashboard.title": "仪表板",
      "dashboard.totalBalance": "总余额",
      "dashboard.monthlyIncome": "月收入",
      "dashboard.monthlyExpenses": "月支出",
      "dashboard.recentTransactions": "最近交易",
      "dashboard.quickActions": "快速操作",
      "dashboard.sendMoney": "转账",
      "dashboard.requestMoney": "请求付款",
      "dashboard.payBills": "支付账单",
      "dashboard.viewAll": "查看全部",
      "dashboard.walletsAccounts": "钱包和账户",
      "dashboard.myBalance": "我的余额",
      "dashboard.income": "收入",
      "dashboard.expenses": "支出",
      "dashboard.manageWallets": "管理您的钱包和交易",
      
      // Settings
      "settings.title": "设置",
      "settings.profile": "个人资料设置",
      "settings.security": "安全",
      "settings.notifications": "通知",
      "settings.language": "语言",
      "settings.save": "保存更改",
      
      // Common
      "common.loading": "加载中...",
      "common.error": "错误",
      "common.success": "成功",
      "common.cancel": "取消",
      "common.confirm": "确认",
      "common.back": "返回",
      "common.next": "下一步",
      "common.submit": "提交",
      "common.close": "关闭",
      
      // Payment
      "payment.amount": "金额",
      "payment.recipient": "收款人",
      "payment.description": "描述",
      "payment.send": "发送付款",
      "payment.success": "支付成功",
      "payment.failed": "支付失败",
      
      // Invoice
      "invoice.title": "发票",
      "invoice.number": "发票号码",
      "invoice.date": "日期",
      "invoice.dueDate": "到期日",
      "invoice.total": "总计",
      "invoice.download": "下载",
      "invoice.send": "发送",
      "invoice.paid": "已付",
      "invoice.pending": "待处理",
    }
  },
  ms: {
    translation: {
      // Navigation
      "nav.signup": "DAFTAR",
      "nav.login": "LOG MASUK →",
      "nav.payNow": "Bayar Sekarang",
      "nav.business": "Perniagaan",
      "nav.logout": "Log Keluar",
      
      // Hero Section
      "hero.title": "Masa Depan",
      "hero.titleHighlight": "Pembayaran Digital",
      "hero.subtitle": "Alami pembayaran yang lancar dan selamat dengan teknologi pengecaman muka dan kod QR. Pantas, boleh dipercayai, dan dibina untuk dunia moden.",
      "hero.getStarted": "Mula →",
      "hero.learnMore": "Ketahui Lebih Lanjut",
      
      // Features
      "features.title": "Alami Ciri Pembayaran Generasi Seterusnya",
      "features.faceRecognition.title": "Pengecaman Muka",
      "features.faceRecognition.description": "Pengesahan biometrik selamat untuk pembayaran segera. Tiada kad, tiada tunai, hanya muka anda.",
      "features.qrCode.title": "Pembayaran Kod QR",
      "features.qrCode.description": "Imbasan kod QR yang cepat dan mudah untuk pembayaran tanpa sentuh di mana-mana sahaja, bila-bila masa.",
      "features.eInvoicing.title": "E-Invois",
      "features.eInvoicing.description": "Penjanaan invois automatik dan resit digital untuk setiap transaksi.",
      
      // Demo Section
      "demo.title": "Cuba Demo",
      "demo.description": "Alami simulasi pembayaran kami dengan data palsu. Tiada wang sebenar terlibat!",
      "demo.startButton": "Mula Demo Pembayaran",
      
      // Footer
      "footer.copyright": "© 2025 PayID - Platform Pembayaran Digital",
      
      // Dashboard
      "dashboard.title": "Papan Pemuka",
      "dashboard.totalBalance": "Jumlah Baki",
      "dashboard.monthlyIncome": "Pendapatan Bulanan",
      "dashboard.monthlyExpenses": "Perbelanjaan Bulanan",
      "dashboard.recentTransactions": "Transaksi Terkini",
      "dashboard.quickActions": "Tindakan Pantas",
      "dashboard.sendMoney": "Hantar Wang",
      "dashboard.requestMoney": "Minta Wang",
      "dashboard.payBills": "Bayar Bil",
      "dashboard.viewAll": "Lihat Semua",
      "dashboard.walletsAccounts": "Dompet & Akaun",
      "dashboard.myBalance": "Baki Saya",
      "dashboard.income": "Pendapatan",
      "dashboard.expenses": "Perbelanjaan",
      "dashboard.manageWallets": "Urus dompet dan transaksi anda",
      
      // Settings
      "settings.title": "Tetapan",
      "settings.profile": "Tetapan Profil",
      "settings.security": "Keselamatan",
      "settings.notifications": "Pemberitahuan",
      "settings.language": "Bahasa",
      "settings.save": "Simpan Perubahan",
      
      // Common
      "common.loading": "Memuatkan...",
      "common.error": "Ralat",
      "common.success": "Berjaya",
      "common.cancel": "Batal",
      "common.confirm": "Sahkan",
      "common.back": "Kembali",
      "common.next": "Seterusnya",
      "common.submit": "Hantar",
      "common.close": "Tutup",
      
      // Payment
      "payment.amount": "Jumlah",
      "payment.recipient": "Penerima",
      "payment.description": "Penerangan",
      "payment.send": "Hantar Pembayaran",
      "payment.success": "Pembayaran Berjaya",
      "payment.failed": "Pembayaran Gagal",
      
      // Invoice
      "invoice.title": "Invois",
      "invoice.number": "Nombor Invois",
      "invoice.date": "Tarikh",
      "invoice.dueDate": "Tarikh Tamat Tempoh",
      "invoice.total": "Jumlah",
      "invoice.download": "Muat Turun",
      "invoice.send": "Hantar",
      "invoice.paid": "Dibayar",
      "invoice.pending": "Menunggu",
    }
  }
};

// Initialize i18next
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;