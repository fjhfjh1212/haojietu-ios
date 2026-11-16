require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name = 'HaoJieTuAlternateIcon'
  s.version = package['version']
  s.summary = 'Alternate app icon switching for 好截图2'
  s.license = { :type => 'MIT' }
  s.homepage = 'https://github.com/fjhfjh1212/haojietu-ios'
  s.author = 'haojietu-ios'
  s.source = { :git => 'https://github.com/fjhfjh1212/haojietu-ios.git', :tag => s.version.to_s }
  s.ios.deployment_target = '14.0'
  s.dependency 'Capacitor'
  s.source_files = 'ios/Plugin/**/*.{swift,h,m}'
  s.swift_version = '5.0'
end
