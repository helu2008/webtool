// script.js

// 1. 获取所有需要操作的DOM元素
const leftPageContent = document.getElementById('leftPageContent');
const leftPageImageInput = document.getElementById('leftPageImage');
const leftPagePreview = document.getElementById('leftPagePreview');

const rightPageContent = document.getElementById('rightPageContent');
const rightPageImageInput = document.getElementById('rightPageImage');
const rightPagePreview = document.getElementById('rightPagePreview');

const middleTopContent = document.getElementById('middleTopContent');
const mmTopLeft = document.getElementById('mmTopLeft');
const mmTopRight = document.getElementById('mmTopRight');
const mmBottomLeft = document.getElementById('mmBottomLeft');
const mmBottomRight = document.getElementById('mmBottomRight');
const middleBottomContent = document.getElementById('middleBottomContent');

const generatePdfBtn = document.getElementById('generatePdfBtn');
const svgPreview = document.getElementById('svgPreview');


// 用于存储图片数据的变量
let leftImageBase64 = null;
let rightImageBase64 = null;

// 2. 图片预览功能
function setupImagePreview(inputElement, previewElement, base64Var) {
    inputElement.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block'; // 显示预览图
                // 将图片数据存储为Base64字符串，以便jsPDF使用
                if (base64Var === 'left') {
                    leftImageBase64 = e.target.result;
                } else if (base64Var === 'right') {
                    rightImageBase64 = e.target.result;
                }
                updateSvgPreview(); // Update SVG preview after image is loaded
            };
            reader.readAsDataURL(file);
        } else {
            previewElement.src = '#';
            previewElement.style.display = 'none'; // 隐藏预览图
            if (base64Var === 'left') {
                leftImageBase64 = null;
            } else if (base64Var === 'right') {
                rightImageBase64 = null;
            }
            updateSvgPreview(); // Update SVG preview if image is removed
        }
    });
}

setupImagePreview(leftPageImageInput, leftPagePreview, 'left');
setupImagePreview(rightPageImageInput, rightPagePreview, 'right');


const svgTemplate = `<svg width="305" height="210" viewBox="0 0 305 210" xmlns="http://www.w3.org/2000/svg">
    <style>
        .border { stroke: black; stroke-width: 0.5; fill: none; }
        .col-line { stroke: black; stroke-width: 0.2; }
        .text { font-family: 'STSong', sans-serif; }
        .vertical-text-div { 
            font-family: 'STSong', 'SimSun', serif; 
            color: black; 
            text-align: center; 
            height: 100%; 
            width: 100%;
            display: flex; 
            flex-direction: column;
            align-items: center; 
            justify-content: center;
            overflow: visible;
            word-break: break-all;
        }
        .char-span {
            display: block;
            line-height: 1.0;
            margin: 0.5px 0;
            padding: 0;
        }
        .main-title-div { 
            font-size: 12px; 
            font-weight: bold;
        }
        .main-title-div .char-span {
            margin: 1px 0;
        }
        .hall-name-div { 
            font-size: 12px; 
            font-weight: bold;
        }
        .hall-name-div .char-span {
            margin: 1px 0;
        }
        .gen-div { 
            font-size: 4px;
        }
        .gen-div .char-span {
            margin: 0.2px 0;
        }
        .gen-top-justified {
            justify-content: flex-start;
        }
        .gen-idx-justified {
            justify-content: space-evenly;
        }
        .gen-idx-justified .char-span {
            margin: 0.05px 0;
        }
        .content-div {
            font-family: 'STSong', 'SimSun', serif; 
            font-size: 8px; 
            color: black; 
            white-space: pre-wrap; 
            word-wrap: break-word; 
            height: 100%;
            padding: 5px;
            line-height: 1.4;
        }
    </style>

    <!-- Outer Border -->
    <rect x="0.25" y="0.25" width="304.5" height="209.5" class="border" />

    <!-- Central Column -->
    <g id="central-column">
        <rect x="142.5" y="0" width="20" height="210" class="border" />
        
        <foreignObject x="145.5" y="2" width="15" height="56">
            <div xmlns="http://www.w3.org/1999/xhtml" id="main-title-content" class="vertical-text-div main-title-div"></div>
        </foreignObject>
        
        <polygon points="142.5,60 162.5,60 162.5,68 152.5,64 142.5,68 142.5,60" fill="black" />

        <foreignObject x="147" y="68" width="4" height="60">
            <div xmlns="http://www.w3.org/1999/xhtml" id="gen-1-content" class="vertical-text-div gen-div gen-top-justified"></div>
        </foreignObject>
        
        <foreignObject x="155" y="68" width="4" height="60">
            <div xmlns="http://www.w3.org/1999/xhtml" id="gen-2-content" class="vertical-text-div gen-div gen-top-justified"></div>
        </foreignObject>

        <foreignObject x="147" y="133" width="4" height="20">
            <div xmlns="http://www.w3.org/1999/xhtml" id="gen-1-idx-content" class="vertical-text-div gen-div gen-idx-justified"></div>
        </foreignObject>
        
        <foreignObject x="155" y="133" width="4" height="20">
            <div xmlns="http://www.w3.org/1999/xhtml" id="gen-2-idx-content" class="vertical-text-div gen-div gen-idx-justified"></div>
        </foreignObject>

        <polygon points="142.5,158 162.5,158 162.5,150 152.5,154 142.5,150 142.5,158" fill="black" />

        <foreignObject x="145.5" y="162" width="15" height="45">
            <div xmlns="http://www.w3.org/1999/xhtml" id="hall-name-content" class="vertical-text-div hall-name-div"></div>
        </foreignObject>
    </g>

    <!-- Content Placeholders -->
    <g id="left-content-group">
        <foreignObject x="10" y="5" width="130" height="165">
            <div xmlns="http://www.w3.org/1999/xhtml" id="left-html-content" class="content-div"></div>
        </foreignObject>
    </g>
    <g id="right-content-group">
        <foreignObject x="165" y="5" width="130" height="165">
            <div xmlns="http://www.w3.org/1999/xhtml" id="right-html-content" class="content-div"></div>
        </foreignObject>
    </g>
</svg>`;

async function updateSvgPreview() {
    // 获取所有文本内容
    const leftText = leftPageContent.value;
    const rightText = rightPageContent.value;
    const middleTopText = middleTopContent.value.trim();
    const mmTL = mmTopLeft.value.trim();
    const mmTR = mmTopRight.value.trim();
    const mmBL = mmBottomLeft.value.trim();
    const mmBR = mmBottomRight.value.trim();
    const middleBottomText = middleBottomContent.value.trim();

    try {
        // 1. Use SVG template from variable
        const svgText = svgTemplate;

        // 2. Parse SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // Helper to set div content with individual character spans for vertical layout
        const setVerticalDivContent = (id, text) => {
            const element = svgDoc.getElementById(id);
            if (element && text) {
                element.innerHTML = '';
                const chars = text.split('');
                chars.forEach(char => {
                    const span = svgDoc.createElementNS('http://www.w3.org/1999/xhtml', 'span');
                    span.setAttribute('class', 'char-span');
                    span.textContent = char;
                    element.appendChild(span);
                });
            } else if (element) {
                element.innerHTML = '';
            }
        };
        
        const leftContentGroup = svgDoc.getElementById('left-content-group');
        if (leftContentGroup) {
            if (leftImageBase64) {
                leftContentGroup.innerHTML = ''; // Clear foreignObject
                const imageElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image');
                imageElement.setAttribute('href', leftImageBase64);
                imageElement.setAttribute('x', '10');
                imageElement.setAttribute('y', '25');
                imageElement.setAttribute('width', '130');
                imageElement.setAttribute('height', '165');
                imageElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                leftContentGroup.appendChild(imageElement);
            } else {
                // The foreignObject is in the template, we just update its content
                const leftHtmlContent = svgDoc.getElementById('left-html-content');
                if (leftHtmlContent) {
                    // To preserve newlines and spaces, we use textContent with pre-wrap style
                    leftHtmlContent.textContent = leftText;
                }
            }
        }

        const rightContentGroup = svgDoc.getElementById('right-content-group');
        if (rightContentGroup) {
            if (rightImageBase64) {
                rightContentGroup.innerHTML = ''; // Clear foreignObject
                const imageElement = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'image');
                imageElement.setAttribute('href', rightImageBase64);
                imageElement.setAttribute('x', '165');
                imageElement.setAttribute('y', '25');
                imageElement.setAttribute('width', '130');
                imageElement.setAttribute('height', '165');
                imageElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                rightContentGroup.appendChild(imageElement);
            } else {
                // The foreignObject is in the template, we just update its content
                const rightHtmlContent = svgDoc.getElementById('right-html-content');
                if (rightHtmlContent) {
                    // To preserve newlines and spaces, we use textContent with pre-wrap style
                    rightHtmlContent.textContent = rightText;
                }
            }
        }

        // Update all text regions using vertical div content
        setVerticalDivContent('main-title-content', middleTopText || '陸氏族谱');
        setVerticalDivContent('gen-1-content', mmTL || '三世');
        setVerticalDivContent('gen-2-content', mmTR || '四世');
        setVerticalDivContent('gen-1-idx-content', mmBL || '零零六');
        setVerticalDivContent('gen-2-idx-content', mmBR || '零零五');
        setVerticalDivContent('hall-name-content', middleBottomText || '三德堂');

        // 4. Serialize SVG to string and display
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgDoc.documentElement);
        svgPreview.innerHTML = svgString;

    } catch (error) {
        console.error('Error updating SVG preview:', error);
        svgPreview.innerHTML = '<p style="color: red;">Error generating preview.</p>';
    }
}

// Add event listeners to textareas
[leftPageContent, rightPageContent, middleTopContent, mmTopLeft, mmTopRight, mmBottomLeft, mmBottomRight, middleBottomContent].forEach(element => {
    element.addEventListener('input', updateSvgPreview);
});

// Initial call to populate the preview
updateSvgPreview();

// 3. 生成PDF的事件监听器
generatePdfBtn.addEventListener('click', async () => {
    const svgElement = svgPreview.querySelector('svg');
    if (!svgElement) {
        alert('Preview is not available or contains errors. Cannot generate PDF.');
        return;
    }

    // Clone the SVG to modify it for PDF generation without affecting the preview
    const svgForPng = svgElement.cloneNode(true);

    // Since we're now using foreignObject with divs, we don't need to manually position vertical text
    // The browser handles the vertical text layout automatically

    try {
        // Convert SVG to PNG data URL to preserve styling
        const svgString = new XMLSerializer().serializeToString(svgForPng);
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 10; // Use a higher scale for better resolution in the PDF
            const svgWidth = svgElement.width.baseVal.value;
            const svgHeight = svgElement.height.baseVal.value;

            canvas.width = svgWidth * scale;
            canvas.height = svgHeight * scale;

            const ctx = canvas.getContext('2d');
            ctx.scale(scale, scale);
            ctx.drawImage(image, 0, 0, svgWidth, svgHeight);

            const pngDataUrl = canvas.toDataURL('image/png');

            // Create PDF
            const doc = new jspdf.jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            const ratio = svgWidth / svgHeight;

            let pdfWidth = pageWidth - 20; // 10mm margin
            let pdfHeight = pdfWidth / ratio;

            if (pdfHeight > pageHeight - 20) {
                pdfHeight = pageHeight - 20;
                pdfWidth = pdfHeight * ratio;
            }

            const x = (pageWidth - pdfWidth) / 2;
            const y = (pageHeight - pdfHeight) / 2;

            doc.addImage(pngDataUrl, 'PNG', x, y, pdfWidth, pdfHeight);
            doc.save('family-tree.pdf');
        };
        image.onerror = () => {
            alert('An error occurred while converting SVG to PNG. Check the console for details.');
        };
        image.src = svgDataUrl;

    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('An error occurred while generating the PDF. Check the console for details.');
    }
});