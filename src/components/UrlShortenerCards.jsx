"use client";
import { useState, useRef, useEffect } from "react";
import { Link, Wifi, FileText, Image as ImageIcon, FileJson, Mail, Phone, User, MessageSquare, MapPin, AppWindow, BarChart3, Download, Palette, ChevronDown, ChevronUp } from "lucide-react";
import jsQR from "jsqr";
import QRCodeStyling from "qr-code-styling";

export default function UrlShortenerCards({ className }) {
    const [menu, setMenu] = useState("qr");
    const [qrCodeValue, setQrCodeValue] = useState("");
    const [qrForDownload, setQrForDownload] = useState(null);
    const [qrType, setQrType] = useState("url");
    const [dragActive, setDragActive] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [trackingDragActive, setTrackingDragActive] = useState(false);
    const [trackingImage, setTrackingImage] = useState(null);
    const [trackingData, setTrackingData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDesign, setShowDesign] = useState(false);
    
    // New Feature States
    const qrRef = useRef(null);
    const [qrCode, setQrCode] = useState(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const qr = new QRCodeStyling({
            width: 200,
            height: 200,
            data: "https://qrquick.com",
            image: "/favicon/QRQuick%20grey%20512.png",
            dotsOptions: { color: "#000000", type: "square" },
            imageOptions: { crossOrigin: "anonymous", margin: 5 },
            backgroundOptions: { color: "#ffffff" },
        });
        setQrCode(qr);
    }, []);

    const [design, setDesign] = useState({
        color: "#000000",
        bgColor: "#ffffff",
        dotType: "square",
        cornerType: "square",
        cornerColor: "#000000",
    });


    const [appsForm, setAppsForm] = useState({
        name: "",
        url: "",
        platform: ""
    });
    
    const [wifiForm, setWifiForm] = useState({
        ssid: "",
        password: "",
        encryption: "WPA"
    });
    
    const [fileDetails, setFileDetails] = useState({
        url: "",
        title: ""
    });

    const [emailForm, setEmailForm] = useState({
        to: "",
        subject: "",
        body: ""
    });

    const [smsForm, setSmsForm] = useState({
        phone: "",
        message: ""
    });

    const [whatsappForm, setWhatsappForm] = useState({
        phone: "",
        message: ""
    });

    const [vCardForm, setVCardForm] = useState({
        firstName: "",
        lastName: "",
        organization: "",
        title: "",
        phone: "",
        email: "",
        address: "",
        website: "",
        note: ""
    });

    const [mapsForm, setMapsForm] = useState({
        location: "",
        label: ""
    });

    const QR_TYPES = [
        { id: 'url', name: 'URL', icon: Link },
        { id: 'wifi', name: 'WiFi', icon: Wifi },
        { id: 'pdf', name: 'PDF', icon: FileText },
        { id: 'image', name: 'Image', icon: ImageIcon },
        { id: 'gdocs', name: 'Google Docs', icon: FileJson },
        { id: 'gdrive', name: 'Google Drive', icon: FileJson },
        { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
        { id: 'email', name: 'Email', icon: Mail },
        { id: 'sms', name: 'SMS', icon: Phone },
        { id: 'vcard', name: 'vCard', icon: User },
        { id: 'maps', name: 'Maps', icon: MapPin },
        { id: 'apps', name: 'Apps', icon: AppWindow },
    ];

    const handleMapsFormChange = (e) => {
        const { name, value } = e.target;
        setMapsForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAppsFormChange = (e) => {
        const { name, value } = e.target;
        setAppsForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMenu = (event) => {
        const targetId = event.target.id;
        setMenu(targetId);
        setQrCodeValue("");
    };

    const handleTypeChange = (type) => {
        setQrType(type);
        setQrCodeValue("");
        if (type !== 'image') {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleWifiFormChange = (e) => {
        const { name, value } = e.target;
        setWifiForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEmailFormChange = (e) => {
        const { name, value } = e.target;
        setEmailForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSmsFormChange = (e) => {
        const { name, value } = e.target;
        setSmsForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWhatsappFormChange = (e) => {
        const { name, value } = e.target;
        setWhatsappForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVCardFormChange = (e) => {
        const { name, value } = e.target;
        setVCardForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileDetailsChange = (e) => {
        const { name, value } = e.target;
        setFileDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files[0];
        handleImageFile(file);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        handleImageFile(file);
    };

    const fetchTrackingData = async (targetShortCode = null) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/links');
            if (response.ok) {
                const data = await response.json();
                
                if (targetShortCode) {
                    // Filter for specific code
                    const specificLink = data.filter(link => link.shortLink === targetShortCode);
                    if (specificLink.length > 0) {
                        setTrackingData(specificLink);
                    } else {
                        setError('QR Code is valid but no tracking data found for this link.');
                        setTrackingData([]);
                    }
                } else {
                    // If no shortCode provided (e.g. manual refresh?), maybe clean up or show nothing?
                    // For now, let's keep it empty to enforce scanning.
                    setTrackingData([]);
                }
            } else {
                setError('Failed to fetch tracking data');
                setTrackingData([]);
            }
        } catch (err) {
            setError('Error fetching tracking data');
            setTrackingData([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch logic removed to require manual scan

    const handleTrackingDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setTrackingDragActive(true);
        } else if (e.type === "dragleave") {
            setTrackingDragActive(false);
        }
    };

    const handleTrackingDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTrackingDragActive(false);
        setError(null);

        // For now, we don't support file drop for tracking in the new dashboard version
        // potentially future feature: upload QR image to track it
    };

    const handleTrackingUpload = async (e) => {
         // Placeholder for future feature
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy:', err);
        });
    };

    const renderTrackingStats = () => {
        if (!trackingData || trackingData.length === 0) {
            return (
                <div className="text-center py-10">
                    <BarChart3 className="size-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-semibold">Scan a QR Code to view statistics</p>
                    <p className="text-gray-400 text-sm mt-2">Upload a QRQuick QR code image to see its tracking data.</p>
                </div>
            );
        }

        const totalClicks = trackingData.reduce((sum, link) => sum + link.clicks, 0);
        const avgClicks = (totalClicks / trackingData.length).toFixed(1);

        return (
            <div className="mt-6 space-y-6">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-600 text-sm font-medium">Total QR Codes</p>
                                <p className="text-3xl font-bold text-blue-900 mt-1">{trackingData.length}</p>
                            </div>
                            <Link className="size-12 text-blue-300" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-600 text-sm font-medium">Total Clicks</p>
                                <p className="text-3xl font-bold text-green-900 mt-1">{totalClicks}</p>
                            </div>
                            <BarChart3 className="size-12 text-green-300" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-600 text-sm font-medium">Avg Clicks</p>
                                <p className="text-3xl font-bold text-purple-900 mt-1">{avgClicks}</p>
                            </div>
                            <BarChart3 className="size-12 text-purple-300" />
                        </div>
                    </div>
                </div>

                {/* Links Table */}
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900">Your Tracked QR Codes</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original URL</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Short Link</th>
                                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {trackingData.map((link) => (
                                    <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                            <div className="flex items-center gap-2">
                                                <Link className="size-4 text-blue-500 flex-shrink-0" />
                                                <span className="truncate" title={link.longLink}>{link.longLink}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <a 
                                                href={`${mounted ? window.location.origin : ''}/${link.shortLink}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                            >
                                                /{link.shortLink}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                                                {link.clicks}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => copyToClipboard(`${window.location.origin}/${link.shortLink}`)}
                                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs font-medium"
                                            >
                                                <Download className="size-3" />
                                                Copy
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const handleImageFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }
            
            // Set preview
            setTrackingImage(URL.createObjectURL(file));
            setTrackingData(null);
            setError(null);
            setIsLoading(true);

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const context = canvas.getContext("2d");
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0, img.width, img.height);
                    
                    const imageData = context.getImageData(0, 0, img.width, img.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        console.log("Found QR code", code.data);
                        
                        // Validate Domain
                        const origin = window.location.origin;
                        if (code.data.startsWith(origin)) {
                            // Extract Short Code
                            // URL format: origin/shortCode
                            const shortCode = code.data.replace(origin + '/', '');
                            
                            // Fetch Stats for this code
                            fetchTrackingData(shortCode);
                        } else {
                            setError('This QR Code is not from QRQuick (domain mismatch). Tracking is only available for QRQuick links.');
                            setIsLoading(false);
                        }
                    } else {
                        setError('Could not decode QR Code. Please ensure the image is clear.');
                        setIsLoading(false);
                    }
                };
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file');
        }
    };

    // Initialize QR Code
    useEffect(() => {
        if (qrRef.current && qrCode) {
            qrRef.current.innerHTML = "";
            qrCode.append(qrRef.current);
        }
    }, [qrCode, menu]);

    // Update QR Code when Design or Value Changes
    useEffect(() => {
        if (!qrCode) return;
        qrCode.update({
            data: qrCodeValue || "https://qrquick.com",
            dotsOptions: { color: design.color, type: design.dotType },
            backgroundOptions: { color: design.bgColor },
            cornersSquareOptions: { color: design.cornerColor, type: design.cornerType },
            cornersDotOptions: { color: design.cornerColor },
        });
    }, [qrCodeValue, design, qrCode]);

    const generateQRValue = () => {
        switch(qrType) {
            case 'url':
                return qrCodeValue;
            case 'wifi':
                return `WIFI:T:${wifiForm.encryption};S:${wifiForm.ssid};P:${wifiForm.password};;`;
            case 'email':
                return `mailto:${emailForm.to}?subject=${encodeURIComponent(emailForm.subject)}&body=${encodeURIComponent(emailForm.body)}`;
            case 'sms':
                return `smsto:${smsForm.phone}:${smsForm.message}`;
            case 'whatsapp':
                return `https://wa.me/${whatsappForm.phone}?text=${encodeURIComponent(whatsappForm.message)}`;
            case 'vcard':
                return `BEGIN:VCARD
VERSION:3.0
N:${vCardForm.lastName};${vCardForm.firstName}
FN:${vCardForm.firstName} ${vCardForm.lastName}
ORG:${vCardForm.organization}
TITLE:${vCardForm.title}
TEL:${vCardForm.phone}
EMAIL:${vCardForm.email}
ADR:;;${vCardForm.address}
URL:${vCardForm.website}
NOTE:${vCardForm.note}
END:VCARD`;
            case 'maps':
                return `http://maps.google.com/maps?q=${encodeURIComponent(mapsForm.location)}`;
            case 'apps':
                return appsForm.url;
            case 'pdf':
            case 'gdocs':
            case 'gdrive':
                return fileDetails.url;
            case 'image':
                return qrCodeValue;
            default:
                return qrCodeValue;
        }
    };

    const validateInput = () => {
        switch(qrType) {
            case 'url': return !!qrCodeValue.trim();
            case 'wifi': return !!wifiForm.ssid && (wifiForm.encryption === 'nopass' || !!wifiForm.password);
            case 'email': return !!emailForm.to;
            case 'sms': return !!smsForm.phone && !!smsForm.message;
            case 'whatsapp': return !!whatsappForm.phone;
            case 'vcard': return !!vCardForm.firstName && !!vCardForm.lastName && !!vCardForm.phone;
            case 'maps': return !!mapsForm.location;
            case 'apps': return !!appsForm.url;
            case 'pdf':
            case 'gdocs':
            case 'gdrive': return !!fileDetails.url;
            case 'image': return !!imageFile;
            default: return false;
        }
    };

    const handleGenerateQrCode = async () => {
        if (!validateInput()) {
            alert('Please fill in all required fields before generating.');
            return;
        }

        let value = generateQRValue();

        // If it's a URL type, try to shorten it first for tracking
        if (qrType === 'url' && (value.startsWith('http://') || value.startsWith('https://'))) {
            setIsLoading(true);
            try {
                const response = await fetch('/api/links', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ longLink: value }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const shortUrl = `${window.location.origin}/${data.shortLink}`;
                    value = shortUrl;
                    console.log("Short link generated:", shortUrl);
                }
            } catch (error) {
                console.error('Error creating short link:', error);
            } finally {
                setIsLoading(false);
            }
        }

        setQrCodeValue(value);
    };

    const downloadQRCode = async (extension) => {
        try {
            await qrCode.download({ extension: extension, name: `qrquick-${Date.now()}` });
        } catch (error) {
            console.error('Error downloading QR code:', error);
        }
    };

    const renderDesignControls = () => (
        <div className="mt-8 border-t pt-6">
            <button 
                className="flex items-center justify-between w-full text-left font-semibold text-lg mb-4"
                onClick={() => setShowDesign(!showDesign)}
            >
                <span className="flex items-center gap-2">
                    <Palette className="size-5" />
                    Customize Design
                </span>
                {showDesign ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
            </button>
            
            {showDesign && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
                    <div>
                        <label className="block text-sm font-medium mb-2">Dots Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={design.color}
                                onChange={(e) => setDesign({...design, color: e.target.value})}
                                className="h-10 w-20 rounded cursor-pointer border border-gray-300"
                            />
                            <span className="text-sm text-gray-600 uppercase">{design.color}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Background Color</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color" 
                                value={design.bgColor}
                                onChange={(e) => setDesign({...design, bgColor: e.target.value})}
                                className="h-10 w-20 rounded cursor-pointer border border-gray-300"
                            />
                            <span className="text-sm text-gray-600 uppercase">{design.bgColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Dots Style</label>
                        <select 
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                            value={design.dotType}
                            onChange={(e) => setDesign({...design, dotType: e.target.value})}
                        >
                            <option value="square">Square</option>
                            <option value="dots">Dots</option>
                            <option value="rounded">Rounded</option>
                            <option value="extra-rounded">Extra Rounded</option>
                            <option value="classy">Classy</option>
                            <option value="classy-rounded">Classy Rounded</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Corner Square Style</label>
                        <select 
                            className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                            value={design.cornerType}
                            onChange={(e) => setDesign({...design, cornerType: e.target.value})}
                        >
                            <option value="square">Square</option>
                            <option value="dot">Dot</option>
                            <option value="extra-rounded">Extra Rounded</option>
                        </select>
                    </div>
                    <div>
                         <label className="block text-sm font-medium mb-2">Corner Color</label>
                         <div className="flex items-center gap-2">
                             <input 
                                 type="color" 
                                 value={design.cornerColor}
                                 onChange={(e) => setDesign({...design, cornerColor: e.target.value})}
                                 className="h-10 w-20 rounded cursor-pointer border border-gray-300"
                             />
                             <span className="text-sm text-gray-600 uppercase">{design.cornerColor}</span>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );



    const renderImageUpload = () => (
        <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            {imagePreview ? (
                <div className="space-y-4">
                    <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="mx-auto rounded-lg max-w-[200px] max-h-[200px] object-contain"
                    />
                    <button
                        onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                            setQrCodeValue("");
                        }}
                        className="text-red-500 hover:text-red-700"
                    >
                        Remove Image
                    </button>
                </div>
            ) : (
                <>
                    <div className="space-y-2">
                        <ImageIcon className="mx-auto size-8 text-gray-400" />
                        <p className="text-gray-600">Drag and drop your image here, or</p>
                        <label className="inline-block bg-neutral-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-neutral-800">
                            Choose File
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Supports: JPG, PNG, GIF (max 5MB)</p>
                </>
            )}
        </div>
    );

    const renderForm = () => {
        switch(qrType) {
            case 'maps':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <input
                                type="text"
                                name="location"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={mapsForm.location}
                                onChange={handleMapsFormChange}
                                placeholder="Enter address or coordinates"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Label (Optional)</label>
                            <input
                                type="text"
                                name="label"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={mapsForm.label}
                                onChange={handleMapsFormChange}
                                placeholder="Enter location name"
                            />
                        </div>
                    </div>
                );
            case 'apps':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Platform</label>
                            <select
                                name="platform"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={appsForm.platform}
                                onChange={handleAppsFormChange}
                            >
                                <option value="">Select Platform</option>
                                <option value="android">Android</option>
                                <option value="ios">iOS</option>
                                <option value="web">Web</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">App URL or ID</label>
                            <input
                                type="text"
                                name="url"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={appsForm.url}
                                onChange={handleAppsFormChange}
                                placeholder="Enter app URL or ID"
                            />
                        </div>
                    </div>
                );
            case 'wifi':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Network Name (SSID)</label>
                            <input
                                type="text"
                                name="ssid"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={wifiForm.ssid}
                                onChange={handleWifiFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={wifiForm.password}
                                onChange={handleWifiFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Encryption</label>
                            <select
                                name="encryption"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={wifiForm.encryption}
                                onChange={handleWifiFormChange}
                            >
                                <option value="WPA">WPA/WPA2</option>
                                <option value="WEP">WEP</option>
                                <option value="nopass">No Password</option>
                            </select>
                        </div>
                    </div>
                );
            case 'whatsapp':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number (with country code)</label>
                            <input
                                type="text"
                                name="phone"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={whatsappForm.phone}
                                onChange={handleWhatsappFormChange}
                                placeholder="e.g., +6281234567890"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                            <textarea
                                name="message"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={whatsappForm.message}
                                onChange={handleWhatsappFormChange}
                                rows="3"
                                placeholder="Enter your message"
                            />
                        </div>
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">To</label>
                            <input
                                type="email"
                                name="to"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={emailForm.to}
                                onChange={handleEmailFormChange}
                                placeholder="email@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={emailForm.subject}
                                onChange={handleEmailFormChange}
                                placeholder="Email subject"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Body</label>
                            <textarea
                                name="body"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={emailForm.body}
                                onChange={handleEmailFormChange}
                                rows="3"
                                placeholder="Email body"
                            />
                        </div>
                    </div>
                );
            case 'sms':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={smsForm.phone}
                                onChange={handleSmsFormChange}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Message</label>
                            <textarea
                                name="message"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={smsForm.message}
                                onChange={handleSmsFormChange}
                                rows="3"
                                placeholder="Enter your message"
                            />
                        </div>

                        </div>
                );
            case 'vcard':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                    value={vCardForm.firstName}
                                    onChange={handleVCardFormChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                    value={vCardForm.lastName}
                                    onChange={handleVCardFormChange}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Organization</label>
                            <input
                                type="text"
                                name="organization"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.organization}
                                onChange={handleVCardFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title/Position</label>
                            <input
                                type="text"
                                name="title"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.title}
                                onChange={handleVCardFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.phone}
                                onChange={handleVCardFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.email}
                                onChange={handleVCardFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <textarea
                                name="address"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.address}
                                onChange={handleVCardFormChange}
                                rows="2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Website</label>
                            <input
                                type="url"
                                name="website"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.website}
                                onChange={handleVCardFormChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Note</label>
                            <textarea
                                name="note"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={vCardForm.note}
                                onChange={handleVCardFormChange}
                                rows="2"
                            />
                        </div>
                    </div>
                );
            case 'pdf':
            case 'gdocs':
            case 'gdrive':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">File URL</label>
                            <input
                                type="text"
                                name="url"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={fileDetails.url}
                                onChange={handleFileDetailsChange}
                                placeholder={`Enter ${qrType.toUpperCase()} URL`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Title (Optional)</label>
                            <input
                                type="text"
                                name="title"
                                className="w-full border border-neutral-300 rounded-lg px-4 py-2"
                                value={fileDetails.title}
                                onChange={handleFileDetailsChange}
                                placeholder="Enter file title"
                            />
                        </div>
                    </div>
                );
            case 'image':
                return renderImageUpload();
            default:
                return (
                    <input 
                        type="text" 
                        className="w-full border border-neutral-300 rounded-lg px-4 py-2 mt-2 font-semibold" 
                        placeholder="Enter URL or text"
                        value={qrCodeValue}
                        onChange={(e) => setQrCodeValue(e.target.value)}
                    />
                );
        }
    };

    return (
        <>
            <div className="flex justify-center gap-4 sm:gap-6 mt-10 flex-wrap">
                <p className={`px-4 py-1 pb-2 ${menu === "qr" ? "bg-neutral-900" : "bg-neutral-500"} hover:bg-neutral-900 text-white rounded-lg font-semibold cursor-pointer transition-colors`} id="qr" onClick={handleMenu}>
                    QR Codes
                </p>
                <p className={`px-4 py-1 pb-2 ${menu === "clicks" ? "bg-neutral-900" : "bg-neutral-500"} hover:bg-neutral-900 text-white rounded-lg font-semibold cursor-pointer transition-colors`} id="clicks" onClick={handleMenu}>
                    Tracking
                </p>
            </div>

            <div className={`${className} ${menu === "qr" ? "" : "hidden"} shadow-[0_0_10px_0_rgba(0,0,0,0.3)] mx-auto mt-6 rounded-lg px-6 py-4 pb-6`}>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-6">
                    {QR_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => handleTypeChange(type.id)}
                            className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors
                                ${qrType === type.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 hover:bg-neutral-200'}`}
                        >
                            <type.icon className="size-4" />
                            <span className="text-sm">{type.name}</span>
                        </button>
                    ))}
                </div>

                <h2 className="font-semibold text-lg mb-4">Enter {qrType.toUpperCase()} Details</h2>
                
                {renderForm()}
                
                {renderDesignControls()}

                <button 
                    className={`w-full bg-neutral-900 text-white font-semibold rounded-lg px-4 py-2 mt-6 text-lg
                        ${!validateInput() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-800'}`}
                    onClick={handleGenerateQrCode}
                    disabled={!validateInput()}
                >
                    Generate QR Code
                </button>
            </div>

            {/* QR Display & Download */}
            <div className={`${className} shadow-[0_0_10px_0_rgba(0,0,0,0.3)] mx-auto mt-6 rounded-lg px-6 py-6 text-center ${menu === 'clicks' ? 'hidden' : ''}`}>
                <h2 className="font-semibold text-lg mb-4">QR Code Preview</h2>
                <div className="flex justify-center mb-6">
                    <div ref={qrRef} />
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <button 
                        onClick={() => downloadQRCode('png')}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Download className="size-4" />
                        Download PNG
                    </button>
                    <button 
                        onClick={() => downloadQRCode('svg')}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                        <Download className="size-4" />
                        Download SVG
                    </button>
                </div>
            </div>

            <div className={`${className} ${menu === "clicks" ? "" : "hidden"} shadow-[0_0_10px_0_rgba(0,0,0,0.3)] mx-auto mt-6 rounded-lg px-6 py-4 pb-6`}>
                <div className="mb-8">
                    <h2 className="font-semibold text-lg mb-4">Scan QR Code Image</h2>
                    
                    {!trackingImage ? (
                        <div 
                            className={`border-2 border-dashed rounded-lg p-6 text-center 
                                ${trackingDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                            onDragEnter={handleTrackingDrag}
                            onDragLeave={handleTrackingDrag}
                            onDragOver={handleTrackingDrag}
                            onDrop={handleTrackingDrop}
                        >
                            <div className="space-y-2">
                                <BarChart3 className="mx-auto size-8 text-gray-400" />
                                <p className="text-gray-600">Drag and drop your QR code image here, or</p>
                                <label className="inline-block bg-neutral-900 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-neutral-800">
                                    Choose File
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleTrackingUpload}
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Supports: JPG, PNG (max 5MB)</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <img 
                                        src={trackingImage} 
                                        alt="QR Code" 
                                        className="w-32 h-32 object-contain"
                                    />
                                    <button
                                        onClick={() => {
                                            setTrackingImage(null);
                                            setTrackingData(null);
                                            setError(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {isLoading && (
                                <div className="text-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900 mx-auto"></div>
                                    <p className="mt-2">Analyzing QR code...</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Always show tracking statistics */}
                {renderTrackingStats()}
            </div>
        </>
    );
}