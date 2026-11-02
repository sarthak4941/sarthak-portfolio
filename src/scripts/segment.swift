import Foundation
import CoreImage
import Vision
import AppKit

func removeBackground(inputPath: String, outputPath: String) {
    guard let inputImage = NSImage(contentsOfFile: inputPath),
          let cgImage = inputImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        print("Failed to load input image at \(inputPath)")
        return
    }

    let request = VNGeneratePersonSegmentationRequest()
    request.qualityLevel = .accurate
    request.outputPixelFormat = kCVPixelFormatType_OneComponent8

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    do {
        try handler.perform([request])
        guard let mask = request.results?.first as? VNPixelBufferObservation else {
            print("No segmentation mask generated")
            return
        }

        let maskBuffer = mask.pixelBuffer
        let maskImage = CIImage(cvPixelBuffer: maskBuffer)

        // Scale mask to original image size
        let originalCI = CIImage(cgImage: cgImage)
        let scaleX = originalCI.extent.width / maskImage.extent.width
        let scaleY = originalCI.extent.height / maskImage.extent.height
        let scaledMask = maskImage.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))

        // Blend: use mask to punch out background
        let filter = CIFilter(name: "CIBlendWithMask")!
        filter.setValue(originalCI, forKey: kCIInputImageKey)
        filter.setValue(CIImage.empty(), forKey: kCIInputBackgroundImageKey)
        filter.setValue(scaledMask, forKey: kCIInputMaskImageKey)

        guard let outputCI = filter.outputImage else {
            print("Failed to blend mask")
            return
        }

        let rep = NSCIImageRep(ciImage: outputCI)
        let finalNSImage = NSImage(size: rep.size)
        finalNSImage.addRepresentation(rep)

        guard let tiffData = finalNSImage.tiffRepresentation,
              let bitmapRep = NSBitmapImageRep(data: tiffData),
              let pngData = bitmapRep.representation(using: .png, properties: [:]) else {
            print("Failed to convert to PNG")
            return
        }

        try pngData.write(to: URL(fileURLWithPath: outputPath))
        print("Successfully generated cutout at \(outputPath)")
    } catch {
        print("Vision error: \(error)")
    }
}

let args = CommandLine.arguments
if args.count >= 3 {
    removeBackground(inputPath: args[1], outputPath: args[2])
} else {
    print("Usage: swift segment.swift <input> <output>")
}
