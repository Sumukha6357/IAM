# IDE Troubleshooting - Lombok Issues

The errors you're seeing are because your IDE cannot process Lombok annotations properly.

## ✅ Solution: Install Lombok Plugin

### For IntelliJ IDEA:
1. **File** → **Settings** → **Plugins**
2. Search for **"Lombok"**
3. Install the **Lombok Plugin** by Michail Plushnikov
4. Restart IntelliJ IDEA
5. **File** → **Settings** → **Build, Execution, Deployment** → **Compiler** → **Annotation Processors**
6. ✅ Check **"Enable annotation processing"**
7. Click **Apply** and **OK**
8. **File** → **Invalidate Caches** → **Invalidate and Restart**

### For VS Code:
1. Install extension: **"Lombok Annotations Support for VS Code"**
2. Reload VS Code
3. Open Command Palette (Ctrl+Shift+P)
4. Run: **"Java: Clean Java Language Server Workspace"**
5. Reload window

### For Eclipse:
1. Download lombok.jar from: https://projectlombok.org/download
2. Run: `java -jar lombok.jar`
3. Select your Eclipse installation
4. Click **Install/Update**
5. Restart Eclipse
6. Right-click project → **Maven** → **Update Project**

## 🐳 Alternative: Use Docker (No IDE Setup Needed)

If you don't want to configure Lombok in your IDE:

```bash
cd c:/Proj/IAM/iam-auth-platform
docker-compose up --build
```

This will compile and run everything without any IDE configuration!

## 📝 What's Happening?

Lombok uses **annotation processing** to generate code at compile time:
- `@Data` generates getters, setters, toString, equals, hashCode
- `@Builder` generates builder pattern code
- `@NoArgsConstructor` / `@AllArgsConstructor` generate constructors

Your IDE needs the Lombok plugin to understand these annotations and see the generated code.

## ✅ After Installing Lombok Plugin

The errors will disappear immediately. No code changes needed!
