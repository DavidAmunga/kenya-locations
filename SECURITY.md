# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take the security of kenya-locations seriously. If you discover a security vulnerability, please
follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not create a public GitHub issue for security vulnerabilities, as this could put users at
risk.

### 2. Report Privately

Please report security vulnerabilities by:

- **Email**: Contact the maintainer at [your-email@example.com]
- **GitHub Security Advisories**: Use
  [GitHub's private vulnerability reporting](https://github.com/davidamunga/kenya-locations/security/advisories/new)

### 3. Include Details

Please include the following information in your report:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### 4. Response Timeline

- We will acknowledge your report within **48 hours**
- We will provide a more detailed response within **7 days** indicating the next steps
- We will keep you informed of the progress toward a fix
- We may ask for additional information or guidance

### 5. Disclosure Policy

- We will coordinate the disclosure timeline with you
- We prefer to fully address vulnerabilities before any disclosure
- We will credit you in the security advisory (unless you prefer to remain anonymous)

## Security Best Practices

When using kenya-locations:

1. **Keep Updated**: Always use the latest version to benefit from security patches
2. **Validate Input**: If you're accepting user input for location searches, validate and sanitize
   it
3. **Dependencies**: Regularly update dependencies to patch known vulnerabilities
4. **Report Issues**: If you notice suspicious behavior, report it

## Security Updates

Security updates will be released as:

- **Patch releases** for minor vulnerabilities
- **Emergency releases** for critical vulnerabilities
- Documented in [CHANGELOG.md](./CHANGELOG.md) with a `[SECURITY]` tag

## Bug Bounty Program

We currently do not have a bug bounty program, but we deeply appreciate security researchers'
efforts and will acknowledge contributions in our releases.

## Questions

If you have questions about this security policy, please open a discussion on GitHub or contact the
maintainers.

---

**Last Updated**: October 23, 2025  
**Maintainer**: David Amunga  
**Website**: https://davidamunga.com
